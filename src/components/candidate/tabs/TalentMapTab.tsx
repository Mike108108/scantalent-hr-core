import { useEffect, useRef, useState } from 'react'
import { useCandidateWorkspace } from '../CandidateWorkspaceContext'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { StatusBadge } from '../../ui/StatusBadge'
import {
  MVP_TALENT_MAP_SECTIONS,
  type TalentMapSectionKey,
  type TalentMapSectionStatus,
} from '../../../lib/talentMapSections'
import {
  isSupportedGeneratedSectionKey,
  SUPPORTED_GENERATED_SECTION_KEYS,
  type SupportedGeneratedSectionKey,
} from '../../../lib/talentMapGeneratedSections'
import type { TalentMapSectionReport } from '../../../lib/talentMapSectionApi'
import {
  formatSectionErrorBadgeLabel,
  SECTION_LAST_ATTEMPT_FAILED_MESSAGE,
  shouldShowTechnicalErrorDetails,
} from '../../../lib/talentMapSectionErrors'
import type { SectionGenerationStatus } from '../../../lib/talentMapSectionTypes'
import {
  DEFAULT_TALENT_MAP_MODEL_PRESET_ID,
  TALENT_MAP_MODEL_PRESET_ORDER,
  TALENT_MAP_MODEL_PRESETS,
  type TalentMapModelPresetId,
} from '../../../lib/talentMapModelPresets'
import {
  isTalentMapGeneratedSectionContent,
} from '../../../lib/talentMapGeneratedSectionContract'
import {
  readSectionParseDiagnostics,
  type SectionParseDiagnosticsContent,
} from '../../../lib/talentMapSectionOpenAiSchema'
import {
  downloadTalentMapSectionReport,
  formatGenerationDurationClock,
  formatGenerationDurationMs,
  resolveLiveProcessingStartMs,
  resolveOpenAiTokenUsage,
  resolveReportGenerationMeta,
  resolveReportGenerationTiming,
} from '../../../lib/talentMapSectionReportExport'
import type { TalentMapStatus } from '../../../lib/types'

function statusBadgeVariant(
  status: SectionGenerationStatus | TalentMapSectionStatus,
): TalentMapStatus {
  switch (status) {
    case 'ready':
      return 'ready'
    case 'error':
    case 'failed':
    case 'input_not_ready':
      return 'error'
    case 'needs_update':
    case 'stale':
    case 'generating':
      return 'processing'
    case 'input_ready':
    case 'not_generated':
      return 'pending'
    default:
      return 'draft'
  }
}

function resolveSectionUiStatus(params: {
  sectionKey: TalentMapSectionKey
  sectionPreviewStatus: SectionGenerationStatus
  report: TalentMapSectionReport | undefined
  isGenerating: boolean
}): { badgeStatus: SectionGenerationStatus | TalentMapSectionStatus; label: string } {
  if (
    (params.isGenerating || params.report?.status === 'processing') &&
    isSupportedGeneratedSectionKey(params.sectionKey)
  ) {
    return { badgeStatus: 'generating', label: 'Собирается' }
  }

  if (params.report?.status === 'ready') {
    const qualityFlags = Array.isArray(params.report.quality_flags)
      ? params.report.quality_flags.filter((item): item is string => typeof item === 'string')
      : []
    if (qualityFlags.length > 0) {
      return { badgeStatus: 'ready', label: 'Раздел собран с предупреждениями' }
    }
    return { badgeStatus: 'ready', label: 'Раздел собран' }
  }

  if (params.report?.status === 'error') {
    return {
      badgeStatus: 'error',
      label: formatSectionErrorBadgeLabel(params.report),
    }
  }

  if (params.sectionPreviewStatus === 'input_ready') {
    return { badgeStatus: 'input_ready', label: 'Ещё не собран' }
  }

  if (params.sectionPreviewStatus === 'input_not_ready') {
    return { badgeStatus: 'input_not_ready', label: 'Вход не готов' }
  }

  return { badgeStatus: 'not_generated', label: 'Ещё не собран' }
}

function SectionCollapseButton(props: {
  expanded: boolean
  sectionTitle: string
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      className="icon-button icon-button--ghost"
      aria-expanded={props.expanded}
      aria-label={
        props.expanded
          ? `Свернуть раздел «${props.sectionTitle}»`
          : `Развернуть раздел «${props.sectionTitle}»`
      }
      title={props.expanded ? 'Свернуть раздел' : 'Развернуть раздел'}
      onClick={props.onToggle}
    >
      <svg
        className={`icon-button__icon icon-button__icon--chevron${props.expanded ? ' icon-button__icon--chevron-expanded' : ''}`}
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M8 10l4 4 4-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

function SectionGenerationProgress() {
  return (
    <div className="section-generation-progress" role="status" aria-live="polite">
      <p className="section-generation-progress__label">Идёт сборка раздела…</p>
      <div className="section-generation-progress__track" aria-hidden="true">
        <div className="section-generation-progress__bar" />
      </div>
    </div>
  )
}

function SectionReportDownloadButton({ report }: { report: TalentMapSectionReport }) {
  return (
    <button
      type="button"
      className="icon-button icon-button--ghost"
      aria-label="Скачать отчёт раздела"
      title="Скачать отчёт раздела"
      onClick={() => {
        downloadTalentMapSectionReport(report)
      }}
    >
      <svg
        className="icon-button__icon"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M12 3v10.55M7.05 8.55 12 13.5l4.95-4.95M5 19h14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

function SectionGenerationTimer(props: {
  report: TalentMapSectionReport | undefined
  isProcessing: boolean
  localStartedAtMs: number | null
}) {
  const [nowMs, setNowMs] = useState(() => Date.now())

  useEffect(() => {
    if (!props.isProcessing) {
      return
    }

    const intervalId = window.setInterval(() => {
      setNowMs(Date.now())
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [props.isProcessing])

  if (props.isProcessing) {
    const startMs = resolveLiveProcessingStartMs({
      report: props.report,
      isProcessing: props.isProcessing,
      localStartedAtMs: props.localStartedAtMs,
    })

    if (startMs !== null) {
      const elapsedMs = Math.max(0, nowMs - startMs)
      const elapsedLabel =
        elapsedMs >= 60_000
          ? formatGenerationDurationMs(elapsedMs)
          : formatGenerationDurationClock(elapsedMs)

      return (
        <p className="section-generation-timer" aria-live="polite">
          Идёт сборка: {elapsedLabel}
        </p>
      )
    }

    return null
  }

  if (!props.report) {
    return null
  }

  const timing = resolveReportGenerationTiming(props.report)

  if (
    (props.report.status === 'ready' || props.report.status === 'error') &&
    timing.durationHuman !== 'not_available'
  ) {
    const durationLabel =
      props.report.status === 'error'
        ? `Время до ошибки: ${timing.durationHuman}`
        : `Длительность сборки: ${timing.durationHuman}`

    return (
      <p className="section-generation-timer section-generation-timer--final">
        {durationLabel}
      </p>
    )
  }

  return null
}

function SectionAssemblyDetails({ report }: { report: TalentMapSectionReport }) {
  const meta = resolveReportGenerationMeta(report)
  const timing = resolveReportGenerationTiming(report)
  const tokenUsage = resolveOpenAiTokenUsage(report)
  const content = isTalentMapGeneratedSectionContent(report.content_json)
    ? report.content_json
    : null

  const hasAssemblyMeta =
    content?.generation_meta ||
    report.model ||
    meta.internalCreditCost !== 'not_available' ||
    meta.estimatedCostUsd !== 'not_available'

  if (!hasAssemblyMeta) {
    return report.model ? (
      <p className="city-autocomplete__hint">Модель сборки: {report.model}</p>
    ) : null
  }

  return (
    <details className="generated-section-details">
      <summary>Сборка</summary>
      <ul className="generated-section-list">
        {meta.presetLabel !== 'not_available' ? (
          <li>
            Качество: {meta.presetLabel}
            {meta.model !== 'not_available' ? ` (${meta.model})` : ''}
          </li>
        ) : meta.model !== 'not_available' ? (
          <li>Модель: {meta.model}</li>
        ) : null}
        {meta.reasoningEffort !== 'not_available' ? (
          <li>Reasoning effort: {meta.reasoningEffort}</li>
        ) : null}
        {meta.maxOutputTokens !== 'not_available' ? (
          <li>
            Max output tokens:{' '}
            {meta.maxOutputTokens === 'not set' ? 'не задан' : meta.maxOutputTokens}
          </li>
        ) : null}
        {meta.internalCreditCost !== 'not_available' ? (
          <li>Внутренние кредиты: {meta.internalCreditCost}</li>
        ) : null}
        {meta.estimatedCostUsd !== 'not_available' ? (
          <li>Техническая оценка API cost: {meta.estimatedCostUsd}</li>
        ) : null}
        {timing.durationHuman !== 'not_available' ? (
          <li>
            {report.status === 'error' ? 'Время до ошибки' : 'Длительность сборки'}:{' '}
            {timing.durationHuman}
          </li>
        ) : null}
        {tokenUsage.inputTokens !== null ? (
          <li>Input tokens: {tokenUsage.inputTokens.toLocaleString('ru-RU')}</li>
        ) : null}
        {tokenUsage.outputTokens !== null ? (
          <li>Output tokens: {tokenUsage.outputTokens.toLocaleString('ru-RU')}</li>
        ) : null}
        {tokenUsage.totalTokens !== null ? (
          <li>Total tokens: {tokenUsage.totalTokens.toLocaleString('ru-RU')}</li>
        ) : null}
      </ul>
    </details>
  )
}

function SectionParseFailureDetails(props: {
  parseDiagnostics: SectionParseDiagnosticsContent
  report: TalentMapSectionReport
}) {
  const { parseDiagnostics, report } = props
  const openAiDiagnostics = parseDiagnostics.openai_response_diagnostics
  const meta = resolveReportGenerationMeta(report)
  const tokenUsage = resolveOpenAiTokenUsage(report)

  return (
    <div className="generated-section-parse-diagnostics stack">
      {parseDiagnostics.error_kind ? (
        <p className="generated-section-result__technical">
          <strong>error_kind:</strong> {parseDiagnostics.error_kind}
        </p>
      ) : null}
      {parseDiagnostics.stage ? (
        <p className="generated-section-result__technical">
          <strong>stage:</strong> {parseDiagnostics.stage}
        </p>
      ) : null}
      {parseDiagnostics.parse_error_message ? (
        <p className="generated-section-result__technical">
          <strong>parse_error_message:</strong> {parseDiagnostics.parse_error_message}
        </p>
      ) : null}
      {openAiDiagnostics?.status ? (
        <p className="generated-section-result__technical">
          <strong>openai status:</strong> {String(openAiDiagnostics.status)}
        </p>
      ) : null}
      {openAiDiagnostics?.incomplete_details ? (
        <p className="generated-section-result__technical">
          <strong>incomplete_details:</strong>{' '}
          {JSON.stringify(openAiDiagnostics.incomplete_details)}
        </p>
      ) : null}
      {meta.estimatedCostUsd !== 'not_available' ? (
        <p className="generated-section-result__technical">
          <strong>Техническая оценка API cost:</strong> {meta.estimatedCostUsd}
        </p>
      ) : null}
      {tokenUsage.inputTokens !== null ? (
        <p className="generated-section-result__technical">
          <strong>input_tokens:</strong> {tokenUsage.inputTokens.toLocaleString('ru-RU')}
        </p>
      ) : null}
      {tokenUsage.outputTokens !== null ? (
        <p className="generated-section-result__technical">
          <strong>output_tokens:</strong> {tokenUsage.outputTokens.toLocaleString('ru-RU')}
        </p>
      ) : null}
      {tokenUsage.totalTokens !== null ? (
        <p className="generated-section-result__technical">
          <strong>total_tokens:</strong> {tokenUsage.totalTokens.toLocaleString('ru-RU')}
        </p>
      ) : null}
      {parseDiagnostics.cleaned_response_preview ? (
        <details className="generated-section-details">
          <summary>cleaned_response_preview</summary>
          <pre className="generated-section-result__technical">
            {parseDiagnostics.cleaned_response_preview}
          </pre>
        </details>
      ) : null}
      {parseDiagnostics.raw_response_preview ? (
        <details className="generated-section-details">
          <summary>raw_response_preview</summary>
          <pre className="generated-section-result__technical">
            {parseDiagnostics.raw_response_preview}
          </pre>
        </details>
      ) : null}
      {parseDiagnostics.parse_strategy_attempts?.length ? (
        <details className="generated-section-details">
          <summary>parse_strategy_attempts</summary>
          <pre className="generated-section-result__technical">
            {JSON.stringify(parseDiagnostics.parse_strategy_attempts, null, 2)}
          </pre>
        </details>
      ) : null}
      {openAiDiagnostics ? (
        <details className="generated-section-details">
          <summary>openai_response_diagnostics</summary>
          <pre className="generated-section-result__technical">
            {JSON.stringify(openAiDiagnostics, null, 2)}
          </pre>
        </details>
      ) : null}
    </div>
  )
}

function SectionGeneratedResult({ report }: { report: TalentMapSectionReport }) {
  const qualityFlags = Array.isArray(report.quality_flags)
    ? report.quality_flags.filter((item): item is string => typeof item === 'string')
    : []

  if (report.status === 'error') {
    const showTechnicalDetails = shouldShowTechnicalErrorDetails(report)
    const parseDiagnostics = readSectionParseDiagnostics(report.content_json)

    return (
      <div className="generated-section-result generated-section-result--error stack">
        <p className="generated-section-result__message">{SECTION_LAST_ATTEMPT_FAILED_MESSAGE}</p>
        {showTechnicalDetails ? (
          <details className="generated-section-details">
            <summary>Показать технические детали</summary>
            <div className="stack">
              {report.generation_error ? (
                <p className="generated-section-result__technical">{report.generation_error}</p>
              ) : null}
              {parseDiagnostics ? (
                <SectionParseFailureDetails
                  parseDiagnostics={parseDiagnostics}
                  report={report}
                />
              ) : null}
              {qualityFlags.length > 0 ? (
                <ul className="generated-section-list">
                  {qualityFlags.map((flag) => (
                    <li key={flag}>{flag}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </details>
        ) : null}
      </div>
    )
  }

  const content = isTalentMapGeneratedSectionContent(report.content_json)
    ? report.content_json
    : null

  return (
    <div className="generated-section-result stack">
      {report.base_markdown ? (
        <div className="generated-section-markdown">{report.base_markdown}</div>
      ) : null}

      <details className="generated-section-details">
        <summary>Техническое основание</summary>
        {report.pro_markdown ? (
          <div className="generated-section-markdown generated-section-markdown--pro">
            {report.pro_markdown}
          </div>
        ) : (
          <p className="city-autocomplete__hint">Техническое основание недоступно.</p>
        )}
      </details>

      {content?.source_chips?.length ? (
        <details className="generated-section-details">
          <summary>Источники</summary>
          <ul className="generated-section-list">
            {content.source_chips.map((chip) => (
              <li key={`${chip.element_kind}:${chip.element_key}`}>
                <strong>{chip.element_label || chip.element_key}</strong>
                <span> — {chip.role_in_layer}</span>
                <p className="generated-section-chip-reason">{chip.reason_used}</p>
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      <SectionAssemblyDetails report={report} />

      {content?.qa ? (
        <details className="generated-section-details">
          <summary>QA результата</summary>
          <ul className="generated-section-list">
            <li>Base language checked: {content.qa.base_language_checked ? 'да' : 'нет'}</li>
            <li>Forbidden terms checked: {content.qa.forbidden_terms_checked ? 'да' : 'нет'}</li>
            <li>Source chips checked: {content.qa.source_chips_checked ? 'да' : 'нет'}</li>
            <li>Limitations present: {content.qa.limitations_present ? 'да' : 'нет'}</li>
          </ul>
        </details>
      ) : null}

      {qualityFlags.length > 0 ? (
        <details className="generated-section-details">
          <summary>QA предупреждения</summary>
          <p className="city-autocomplete__hint">Есть предупреждения качества:</p>
          <ul className="generated-section-list">
            {qualityFlags.map((flag) => (
              <li key={flag}>{flag}</li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  )
}

function ModelPresetSelector(props: {
  selectedPresetId: TalentMapModelPresetId
  onChange: (presetId: TalentMapModelPresetId) => void
  disabled: boolean
}) {
  return (
    <div className="model-preset-selector stack">
      <div>
        <p className="model-preset-selector__title">Глубина сборки</p>
        <p className="city-autocomplete__hint">
          Выберите глубину HR-разбора. Чем глубже сборка, тем больше внутренних кредитов.
        </p>
      </div>
      <div className="model-preset-selector__options stack">
        {TALENT_MAP_MODEL_PRESET_ORDER.map((presetId) => {
          const preset = TALENT_MAP_MODEL_PRESETS[presetId]
          const inputId = `model-preset-${presetId}`

          return (
            <label key={presetId} className="model-preset-option" htmlFor={inputId}>
              <input
                id={inputId}
                type="radio"
                name="model_preset_id"
                value={presetId}
                checked={props.selectedPresetId === presetId}
                disabled={props.disabled}
                onChange={() => {
                  props.onChange(presetId)
                }}
              />
              <span className="model-preset-option__content">
                <span className="model-preset-option__label">
                  {preset.ui_label} — {preset.internal_credit_cost} кредитов
                </span>
                <span className="model-preset-option__description">{preset.ui_description}</span>
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

function buildInitialExpandedSectionKeys(
  sectionReports: Partial<Record<TalentMapSectionKey, TalentMapSectionReport>>,
): Set<TalentMapSectionKey> {
  const keys = new Set<TalentMapSectionKey>()

  for (const section of MVP_TALENT_MAP_SECTIONS) {
    const report = sectionReports[section.key]
    const isReadyOrProcessing =
      report?.status === 'ready' || report?.status === 'processing'

    if (isSupportedGeneratedSectionKey(section.key) || isReadyOrProcessing) {
      keys.add(section.key)
    }
  }

  return keys
}

export function TalentMapTab() {
  const {
    bundleResult,
    synthesisPreview,
    sectionInputAudit,
    chartUiStatus,
    sectionReports,
    sectionReportsLoading,
    sectionReportsError,
    sectionGenerationError,
    sectionGenerationTechnicalError,
    activeGeneratingSectionKey,
    handleGenerateTalentMapSection,
  } = useCandidateWorkspace()

  const [selectedModelPresetId, setSelectedModelPresetId] = useState<TalentMapModelPresetId>(
    DEFAULT_TALENT_MAP_MODEL_PRESET_ID,
  )
  const [localGenerationStartedAtBySection, setLocalGenerationStartedAtBySection] = useState<
    Partial<Record<TalentMapSectionKey, number>>
  >({})
  const [expandedSectionKeys, setExpandedSectionKeys] = useState<Set<TalentMapSectionKey>>(
    () => new Set(SUPPORTED_GENERATED_SECTION_KEYS),
  )
  const accordionInitializedRef = useRef(false)

  useEffect(() => {
    if (accordionInitializedRef.current || sectionReportsLoading) {
      return
    }

    accordionInitializedRef.current = true
    setExpandedSectionKeys(buildInitialExpandedSectionKeys(sectionReports))
  }, [sectionReports, sectionReportsLoading])

  const toggleSectionExpanded = (sectionKey: TalentMapSectionKey) => {
    setExpandedSectionKeys((prev) => {
      const next = new Set(prev)
      if (next.has(sectionKey)) {
        next.delete(sectionKey)
      } else {
        next.add(sectionKey)
      }
      return next
    })
  }

  const collectedCount = MVP_TALENT_MAP_SECTIONS.filter(
    (section) => sectionReports[section.key]?.status === 'ready',
  ).length
  const totalSections = MVP_TALENT_MAP_SECTIONS.length

  const selectedPreset = TALENT_MAP_MODEL_PRESETS[selectedModelPresetId]

  const canGenerateBase =
    chartUiStatus === 'calculated' &&
    Boolean(bundleResult?.ok && bundleResult.bundle) &&
    Boolean(synthesisPreview) &&
    sectionInputAudit?.overall_severity === 'ok' &&
    !activeGeneratingSectionKey

  const canGenerateSectionFor = (sectionKey: SupportedGeneratedSectionKey) => {
    const sectionPreview = synthesisPreview?.sections.find(
      (item) => item.section_key === sectionKey,
    )

    return (
      canGenerateBase &&
      sectionPreview?.generation_status === 'input_ready' &&
      sectionReports[sectionKey]?.status !== 'processing'
    )
  }

  return (
    <div className="stack workspace-sections">
      <div className="section-header">
        <div>
          <h2 className="section-header__title">Карта талантов</h2>
          <p className="section-header__subtitle">
            Собрано: {collectedCount} из {totalSections} разделов
          </p>
        </div>
        <div className="form-actions">
          <Button type="button" disabled>
            Собрать всю карту
          </Button>
          <Button type="button" variant="secondary" disabled>
            Выбрать разделы
          </Button>
        </div>
      </div>

      <p className="city-autocomplete__hint">
        Токены списываются только за выбранные разделы карты талантов.
      </p>

      {sectionReportsLoading ? (
        <p className="city-autocomplete__hint">Загрузка сохранённых разделов…</p>
      ) : null}

      {sectionReportsError ? (
        <p className="form-error" role="alert">
          {sectionReportsError}
        </p>
      ) : null}

      {sectionGenerationError ? (
        <div className="stack">
          <p className="form-error" role="alert">
            {sectionGenerationError}
          </p>
          {sectionGenerationTechnicalError ? (
            <details className="generated-section-details" open>
              <summary>Технические детали</summary>
              <pre className="generated-section-result__technical">
                {sectionGenerationTechnicalError}
              </pre>
            </details>
          ) : null}
        </div>
      ) : null}

      <div className="talent-section-grid">
        {MVP_TALENT_MAP_SECTIONS.map((section) => {
          const sectionPreview = synthesisPreview?.sections.find(
            (item) => item.section_key === section.key,
          )

          const generationStatus: SectionGenerationStatus =
            sectionPreview?.generation_status ?? 'not_generated'

          const supportedGeneratedSectionKey = isSupportedGeneratedSectionKey(section.key)
            ? section.key
            : null

          const report = sectionReports[section.key]
          const uiStatus = resolveSectionUiStatus({
            sectionKey: section.key,
            sectionPreviewStatus: generationStatus,
            report,
            isGenerating:
              supportedGeneratedSectionKey !== null &&
              activeGeneratingSectionKey === supportedGeneratedSectionKey,
          })

          const budget = sectionPreview?.budget_summary
          const sourcesReady = budget?.total_selected ?? bundleResult?.coverage?.matched_elements ?? 0
          const isSupportedSection = supportedGeneratedSectionKey !== null
          const canGenerateSection = supportedGeneratedSectionKey
            ? canGenerateSectionFor(supportedGeneratedSectionKey)
            : false
          const sectionIsReady = report?.status === 'ready'
          const sectionIsError = report?.status === 'error'
          const sectionIsProcessing =
            isSupportedSection &&
            (activeGeneratingSectionKey === supportedGeneratedSectionKey ||
              report?.status === 'processing')
          const isSectionExpanded = expandedSectionKeys.has(section.key)
          const localStartedAtMs = supportedGeneratedSectionKey
            ? (localGenerationStartedAtBySection[supportedGeneratedSectionKey] ?? null)
            : null

          return (
            <Card
              key={section.key}
              className={`talent-section-card${isSectionExpanded ? '' : ' talent-section-card--collapsed'}`}
            >
              <div className="stack">
                <div className="talent-section-card__header">
                  <h3 className="talent-section-card__title">{section.title}</h3>
                  <div className="talent-section-card__status-row">
                    <StatusBadge
                      status={statusBadgeVariant(uiStatus.badgeStatus)}
                      label={uiStatus.label}
                    />
                    {sectionIsReady && report ? (
                      <SectionReportDownloadButton report={report} />
                    ) : null}
                    <SectionCollapseButton
                      expanded={isSectionExpanded}
                      sectionTitle={section.title}
                      onToggle={() => {
                        toggleSectionExpanded(section.key)
                      }}
                    />
                  </div>
                </div>

                {isSectionExpanded ? (
                  <div className="talent-section-card__body stack">
                    {sectionIsProcessing ? (
                      <div className="section-generation-status stack">
                        <SectionGenerationProgress />
                        {isSupportedSection ? (
                          <SectionGenerationTimer
                            report={report}
                            isProcessing={sectionIsProcessing}
                            localStartedAtMs={localStartedAtMs}
                          />
                        ) : null}
                      </div>
                    ) : isSupportedSection ? (
                      <SectionGenerationTimer
                        report={report}
                        isProcessing={sectionIsProcessing}
                        localStartedAtMs={localStartedAtMs}
                      />
                    ) : null}
                    <p className="talent-section-card__description">{section.description}</p>
                    <dl className="info-list info-list--compact">
                      <div className="info-list__row">
                        <dt>Подготовка входа</dt>
                        <dd>
                          {generationStatus === 'input_ready'
                            ? 'Готово к сборке'
                            : generationStatus === 'input_not_ready'
                              ? 'Вход не готов'
                              : 'Ожидает данных карты'}
                        </dd>
                      </div>
                      <div className="info-list__row">
                        <dt>Подготовленные источники</dt>
                        <dd>{sourcesReady}</dd>
                      </div>
                      {budget ? (
                        <>
                          <div className="info-list__row">
                            <dt>Primary / Supporting / Context</dt>
                            <dd>
                              {budget.primary_selected} / {budget.supporting_selected} /{' '}
                              {budget.context_selected}
                            </dd>
                          </div>
                          <div className="info-list__row">
                            <dt>Примерный размер входа</dt>
                            <dd>
                              ~{budget.total_digest_chars.toLocaleString('ru-RU')} симв. (
                              ~{budget.estimated_input_tokens.toLocaleString('ru-RU')} ед.)
                            </dd>
                          </div>
                        </>
                      ) : null}
                      <div className="info-list__row">
                        <dt>Сложность сборки</dt>
                        <dd>{section.compute_weight}</dd>
                      </div>
                    </dl>

                    {report && report.status !== 'processing' && !sectionIsProcessing ? (
                      <SectionGeneratedResult report={report} />
                    ) : null}

                    {isSupportedSection ? (
                      <ModelPresetSelector
                        selectedPresetId={selectedModelPresetId}
                        onChange={setSelectedModelPresetId}
                        disabled={!canGenerateSection || sectionIsProcessing}
                      />
                    ) : null}

                    <div className="form-actions">
                      {isSupportedSection ? (
                        <>
                          <Button
                            type="button"
                            disabled={!canGenerateSection || sectionIsProcessing}
                            onClick={() => {
                              if (!supportedGeneratedSectionKey) {
                                return
                              }

                              setLocalGenerationStartedAtBySection((prev) => ({
                                ...prev,
                                [supportedGeneratedSectionKey]: Date.now(),
                              }))
                              setExpandedSectionKeys((prev) => {
                                const next = new Set(prev)
                                next.add(section.key)
                                return next
                              })
                              void handleGenerateTalentMapSection(
                                supportedGeneratedSectionKey,
                                selectedModelPresetId,
                              )
                            }}
                          >
                            {sectionIsProcessing
                              ? 'Собирается…'
                              : sectionIsReady
                                ? 'Пересобрать раздел'
                                : sectionIsError
                                  ? 'Повторить генерацию'
                                  : 'Собрать раздел'}
                          </Button>
                          {sectionIsProcessing ? (
                            <p className="city-autocomplete__hint">
                              Собирается. Обычно это занимает до минуты.
                            </p>
                          ) : (
                            <p className="city-autocomplete__hint">
                              Будет списано: {selectedPreset.internal_credit_cost} кредитов
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          <Button type="button" disabled>
                            Собрать раздел
                          </Button>
                          <p className="city-autocomplete__hint">
                            Будет подключено после проверки первых разделов
                          </p>
                        </>
                      )}
                      <Button
                        variant="secondary"
                        to={`/app/candidate/foundations?section=${section.key}`}
                      >
                        Показать основания
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
