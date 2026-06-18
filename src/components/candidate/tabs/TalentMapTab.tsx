import { useState } from 'react'
import { useCandidateWorkspace } from '../CandidateWorkspaceContext'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { StatusBadge } from '../../ui/StatusBadge'
import {
  MVP_TALENT_MAP_SECTIONS,
  type TalentMapSectionKey,
  type TalentMapSectionStatus,
} from '../../../lib/talentMapSections'
import type { TalentMapSectionReport } from '../../../lib/talentMapSectionApi'
import {
  formatSectionErrorBadgeLabel,
  formatSectionErrorUserMessage,
  isEndpointTransportError,
  isPostGenerationQaFailure,
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
  if (params.isGenerating && params.sectionKey === 'work_mode_and_entry') {
    return { badgeStatus: 'generating', label: 'Сборка…' }
  }

  if (params.report?.status === 'ready') {
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

function SectionGeneratedResult({ report }: { report: TalentMapSectionReport }) {
  const qualityFlags = Array.isArray(report.quality_flags)
    ? report.quality_flags.filter((item): item is string => typeof item === 'string')
    : []

  if (report.status === 'error') {
    const isQaFailure = isPostGenerationQaFailure(report)
    const userMessage = formatSectionErrorUserMessage(report.generation_error)
    const showTechnicalDetails = shouldShowTechnicalErrorDetails(report)

    return (
      <div className="generated-section-result generated-section-result--error stack">
        <p className="generated-section-result__message">{userMessage}</p>
        {isQaFailure && qualityFlags.length > 0 ? (
          <details className="generated-section-details">
            <summary>QA результата</summary>
            <ul className="generated-section-list">
              {qualityFlags.map((flag) => (
                <li key={flag}>{flag}</li>
              ))}
            </ul>
          </details>
        ) : null}
        {showTechnicalDetails ? (
          <details className="generated-section-details">
            <summary>QA результата</summary>
            <div className="stack">
              {report.generation_error ? (
                <p className="generated-section-result__technical">{report.generation_error}</p>
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

      {content && 'generation_meta' in content && content.generation_meta ? (
        <details className="generated-section-details">
          <summary>Сборка</summary>
          <ul className="generated-section-list">
            <li>
              Качество: {content.generation_meta.model_preset_label} (
              {content.generation_meta.model})
            </li>
            <li>Reasoning effort: {content.generation_meta.reasoning_effort}</li>
            <li>Max output tokens: {content.generation_meta.max_output_tokens}</li>
            <li>Внутренние токены: {content.generation_meta.internal_credit_cost}</li>
            {content.generation_meta.estimated_cost_usd !== null ? (
              <li>
                Оценка стоимости: ~${content.generation_meta.estimated_cost_usd.toFixed(4)} USD
              </li>
            ) : null}
          </ul>
        </details>
      ) : report.model ? (
        <p className="city-autocomplete__hint">Модель сборки: {report.model}</p>
      ) : null}

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
        <p className="model-preset-selector__title">Качество сборки</p>
        <p className="city-autocomplete__hint">
          Выберите, какой моделью собрать раздел. Чем выше качество, тем дороже сборка во внутренних
          токенах.
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
                  {preset.ui_label} — {preset.internal_credit_cost} токенов
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

export function TalentMapTab() {
  const {
    bundleResult,
    synthesisPreview,
    sectionInputAudit,
    chartUiStatus,
    sectionReports,
    sectionReportsLoading,
    sectionReportsError,
    sectionGenerationLoading,
    sectionGenerationError,
    sectionGenerationTechnicalError,
    handleGenerateWorkModeAndEntrySection,
  } = useCandidateWorkspace()

  const [selectedModelPresetId, setSelectedModelPresetId] = useState<TalentMapModelPresetId>(
    DEFAULT_TALENT_MAP_MODEL_PRESET_ID,
  )

  const collectedCount = MVP_TALENT_MAP_SECTIONS.filter(
    (section) => sectionReports[section.key]?.status === 'ready',
  ).length
  const totalSections = MVP_TALENT_MAP_SECTIONS.length

  const workModePreview = synthesisPreview?.sections.find(
    (section) => section.section_key === 'work_mode_and_entry',
  )

  const selectedPreset = TALENT_MAP_MODEL_PRESETS[selectedModelPresetId]

  const canGenerateWorkMode =
    chartUiStatus === 'calculated' &&
    Boolean(bundleResult?.ok && bundleResult.bundle) &&
    Boolean(synthesisPreview) &&
    sectionInputAudit?.overall_severity === 'ok' &&
    workModePreview?.generation_status === 'input_ready' &&
    !sectionGenerationLoading

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
          {sectionGenerationTechnicalError &&
          isEndpointTransportError(sectionGenerationTechnicalError) ? (
            <details className="generated-section-details">
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

          const report = sectionReports[section.key]
          const uiStatus = resolveSectionUiStatus({
            sectionKey: section.key,
            sectionPreviewStatus: generationStatus,
            report,
            isGenerating: sectionGenerationLoading && section.key === 'work_mode_and_entry',
          })

          const budget = sectionPreview?.budget_summary
          const sourcesReady = budget?.total_selected ?? bundleResult?.coverage?.matched_elements ?? 0
          const isWorkModeSection = section.key === 'work_mode_and_entry'
          const canGenerateSection = isWorkModeSection && canGenerateWorkMode
          const sectionIsReady = report?.status === 'ready'

          return (
            <Card key={section.key} className="talent-section-card">
              <div className="stack">
                <div className="talent-section-card__header">
                  <h3 className="talent-section-card__title">{section.title}</h3>
                  <StatusBadge
                    status={statusBadgeVariant(uiStatus.badgeStatus)}
                    label={uiStatus.label}
                  />
                </div>
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

                {report ? <SectionGeneratedResult report={report} /> : null}

                {isWorkModeSection ? (
                  <ModelPresetSelector
                    selectedPresetId={selectedModelPresetId}
                    onChange={setSelectedModelPresetId}
                    disabled={!canGenerateSection || sectionGenerationLoading}
                  />
                ) : null}

                <div className="form-actions">
                  {isWorkModeSection ? (
                    <>
                      <Button
                        type="button"
                        disabled={!canGenerateSection}
                        onClick={() => {
                          void handleGenerateWorkModeAndEntrySection(selectedModelPresetId)
                        }}
                      >
                        {sectionGenerationLoading
                          ? 'Сборка…'
                          : sectionIsReady
                            ? 'Пересобрать раздел'
                            : 'Собрать раздел'}
                      </Button>
                      <p className="city-autocomplete__hint">
                        Будет списано: {selectedPreset.internal_credit_cost} токенов
                      </p>
                    </>
                  ) : (
                    <>
                      <Button type="button" disabled>
                        Собрать раздел
                      </Button>
                      <p className="city-autocomplete__hint">
                        Будет подключено после проверки первого раздела
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
            </Card>
          )
        })}
      </div>
    </div>
  )
}
