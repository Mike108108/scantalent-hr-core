import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ELEMENT_KINDS, ELEMENT_UI_GROUPS } from '../../../lib/elementKnowledgeBaseContract'
import { MVP_TALENT_MAP_SECTIONS } from '../../../lib/talentMapSections'
import type {
  SectionInputAuditIssue,
  SectionInputAuditSeverity,
} from '../../../lib/talentMapSectionInputAudit'
import { useCandidateWorkspace } from '../CandidateWorkspaceContext'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { StatusBadge } from '../../ui/StatusBadge'

type ViewMode = 'all' | 'problems'
type ContentMode = 'base' | 'pro'

const AUDIT_SEVERITY_ORDER: Exclude<SectionInputAuditSeverity, 'ok'>[] = [
  'error',
  'warning',
  'info',
]

const AUDIT_SEVERITY_LABELS: Record<Exclude<SectionInputAuditSeverity, 'ok'>, string> = {
  error: 'Ошибки',
  warning: 'Предупреждения',
  info: 'Информация',
}

function auditOverallStatusLabel(severity: SectionInputAuditSeverity): string {
  if (severity === 'error') {
    return 'есть ошибки'
  }
  if (severity === 'warning') {
    return 'есть предупреждения'
  }
  return 'OK'
}

function auditStatusBadge(severity: SectionInputAuditSeverity): 'ready' | 'processing' | 'error' | 'draft' {
  if (severity === 'error') {
    return 'error'
  }
  if (severity === 'warning') {
    return 'processing'
  }
  return 'ready'
}

function groupAuditIssuesBySeverity(
  issues: SectionInputAuditIssue[],
): Record<Exclude<SectionInputAuditSeverity, 'ok'>, SectionInputAuditIssue[]> {
  return {
    error: issues.filter((issue) => issue.severity === 'error'),
    warning: issues.filter((issue) => issue.severity === 'warning'),
    info: issues.filter((issue) => issue.severity === 'info'),
  }
}

export function FoundationsTab() {
  const {
    bundleResult,
    bundleLoading,
    bundleError,
    synthesisPreview,
    sectionInputAudit,
    handleBuildReferenceBundle,
    chart,
    setDrawerSelection,
  } = useCandidateWorkspace()
  const [searchParams] = useSearchParams()
  const sectionFilter = searchParams.get('section')

  const [viewMode, setViewMode] = useState<ViewMode>('all')
  const [contentMode, setContentMode] = useState<ContentMode>('base')
  const [kindFilter, setKindFilter] = useState<string>('all')
  const [showJson, setShowJson] = useState(false)
  const [showSectionDebugJson, setShowSectionDebugJson] = useState(false)
  const [showAuditJson, setShowAuditJson] = useState(false)

  const coverage = bundleResult?.coverage
  const bundle = bundleResult?.bundle

  const filteredItems = useMemo(() => {
    if (!bundle?.items) {
      return []
    }

    let items = bundle.items

    if (viewMode === 'problems') {
      items = items.filter((item) => !item.matched || item.missing_reason)
    }

    if (kindFilter !== 'all') {
      items = items.filter((item) => item.element.element_kind === kindFilter)
    }

    return items
  }, [bundle?.items, viewMode, kindFilter])

  const groupedByKind = useMemo(() => {
    const groups = new Map<string, typeof filteredItems>()
    for (const item of filteredItems) {
      const kind = item.element.element_kind
      const list = groups.get(kind) ?? []
      list.push(item)
      groups.set(kind, list)
    }
    return groups
  }, [filteredItems])

  const sectionMeta = MVP_TALENT_MAP_SECTIONS.find((s) => s.key === sectionFilter)
  const sectionPreview = synthesisPreview?.sections.find((s) => s.section_key === sectionFilter)
  const groupedAuditIssues = useMemo(
    () => groupAuditIssuesBySeverity(sectionInputAudit?.issues ?? []),
    [sectionInputAudit?.issues],
  )

  const sourceQualitySummary = useMemo(() => {
    if (!bundle?.items.length) {
      return null
    }

    const counts = new Map<string, number>()
    for (const item of bundle.items) {
      const quality = item.interpretation?.source_quality ?? 'unknown'
      counts.set(quality, (counts.get(quality) ?? 0) + 1)
    }
    return counts
  }, [bundle?.items])

  if (!chart) {
    return (
      <Card>
        <p className="empty-state">Сначала рассчитайте техническую карту.</p>
      </Card>
    )
  }

  return (
    <div className="stack workspace-sections">
      <div className="section-header">
        <div>
          <h2 className="section-header__title">Основания</h2>
          <p className="section-header__subtitle">
            Техническое и экспертное основание карты
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          disabled={bundleLoading}
          onClick={() => void handleBuildReferenceBundle()}
        >
          {bundleLoading ? 'Обновление…' : 'Обновить bundle'}
        </Button>
      </div>

      {sectionMeta ? (
        <p className="city-autocomplete__hint">Основания раздела: {sectionMeta.title}</p>
      ) : null}

      {bundleError ? (
        <div className="alert alert--error" role="alert">
          {bundleError}
        </div>
      ) : null}

      {bundleLoading && !bundle ? (
        <div className="page-loading" role="status">
          <span className="spinner" aria-hidden="true" />
          <span>Загрузка оснований…</span>
        </div>
      ) : null}

      {sectionPreview ? (
        <Card title={`Подготовленные источники · ${sectionPreview.section_title}`}>
          <dl className="info-list info-list--compact">
            <div className="info-list__row">
              <dt>Статус подготовки входа</dt>
              <dd>{sectionPreview.user_status_label}</dd>
            </div>
            <div className="info-list__row">
              <dt>Выбрано источников</dt>
              <dd>{sectionPreview.budget_summary.total_selected}</dd>
            </div>
            <div className="info-list__row">
              <dt>Primary / Supporting / Context</dt>
              <dd>
                {sectionPreview.budget_summary.primary_selected} /{' '}
                {sectionPreview.budget_summary.supporting_selected} /{' '}
                {sectionPreview.budget_summary.context_selected}
              </dd>
            </div>
            <div className="info-list__row">
              <dt>Отложено по budget</dt>
              <dd>{sectionPreview.budget_summary.omitted_count}</dd>
            </div>
            <div className="info-list__row">
              <dt>Примерный размер входа для будущей сборки</dt>
              <dd>
                ~{sectionPreview.budget_summary.total_digest_chars.toLocaleString('ru-RU')} симв. (
                ~{sectionPreview.budget_summary.estimated_input_tokens.toLocaleString('ru-RU')} ед.)
              </dd>
            </div>
            <div className="info-list__row">
              <dt>Стоимость раздела</dt>
              <dd>{sectionPreview.credit_cost} токен</dd>
            </div>
          </dl>

          {sectionPreview.warnings.length > 0 ? (
            <div className="stack">
              <h4 className="bundle-coverage__subtitle">Предупреждения</h4>
              <ul className="compact-list">
                {sectionPreview.warnings.map((warning) => (
                  <li key={warning} className="compact-list__item compact-list__item--static">
                    <span className="compact-list__primary">{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {sectionPreview.guardrails.section_guardrails.length > 0 ? (
            <div className="stack">
              <h4 className="bundle-coverage__subtitle">Guardrails раздела</h4>
              <ul className="compact-list">
                {sectionPreview.guardrails.section_guardrails.map((rule) => (
                  <li key={rule} className="compact-list__item compact-list__item--static">
                    <span className="compact-list__primary">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="stack">
            <h4 className="bundle-coverage__subtitle">Выбранные источники</h4>
            <ul className="compact-list">
              {sectionPreview.source_items.map((item) => (
                <li key={`${item.element_kind}:${item.element_key}`} className="compact-list__item">
                  <button
                    type="button"
                    className="compact-list__button"
                    onClick={() =>
                      setDrawerSelection({
                        elementKind: item.element_kind,
                        elementKey: item.element_key,
                        label: item.element_label ?? item.element_key,
                      })
                    }
                  >
                    <span className="compact-list__primary">
                      {item.element_label ?? item.element_key}
                    </span>
                    <span className="compact-list__secondary mono-text">
                      {item.source_role} · score {item.rank_score}
                    </span>
                  </button>
                  <StatusBadge
                    status={item.matched ? 'ready' : 'error'}
                    label={item.matched ? 'matched' : 'missing'}
                  />
                </li>
              ))}
            </ul>
          </div>

          {sectionPreview.omitted_by_budget.length > 0 ? (
            <div className="stack">
              <h4 className="bundle-coverage__subtitle">Отложено по budget</h4>
              <ul className="compact-list">
                {sectionPreview.omitted_by_budget.map((item) => (
                  <li
                    key={`omitted:${item.element_kind}:${item.element_key}`}
                    className="compact-list__item compact-list__item--static"
                  >
                    <span className="compact-list__primary">
                      {item.element_label ?? item.element_key}
                    </span>
                    <span className="compact-list__secondary mono-text">
                      {item.source_role} · score {item.rank_score}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="stack">
            <h4 className="bundle-coverage__subtitle">Ranking reasons (выбранные)</h4>
            <ul className="compact-list">
              {sectionPreview.source_items.slice(0, 12).map((item) => (
                <li
                  key={`rank:${item.element_kind}:${item.element_key}`}
                  className="compact-list__item compact-list__item--static"
                >
                  <span className="compact-list__primary mono-text">
                    {item.element_kind}/{item.element_key}
                  </span>
                  <span className="compact-list__secondary">{item.rank_reasons.join(' · ')}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="stack">
            <h4 className="bundle-coverage__subtitle">Digest preview</h4>
            <ul className="synthesis-layer-list__items">
              {sectionPreview.source_digests.map((digestItem) => (
                <li
                  key={`digest:${digestItem.element_kind}:${digestItem.element_key}`}
                  className="synthesis-layer-list__item"
                >
                  <div className="synthesis-layer-list__header">
                    <span className="synthesis-layer-list__title">
                      {digestItem.element_label ?? digestItem.element_key}
                    </span>
                    <span className="synthesis-layer-list__stats">{digestItem.source_role}</span>
                  </div>
                  {digestItem.digest.plain_meaning ? (
                    <p className="city-autocomplete__hint">{digestItem.digest.plain_meaning}</p>
                  ) : null}
                  {digestItem.digest.work_manifestation ? (
                    <p className="city-autocomplete__hint">{digestItem.digest.work_manifestation}</p>
                  ) : null}
                  {contentMode === 'pro' && digestItem.digest.composition_meta ? (
                    <p className="city-autocomplete__hint mono-text">
                      composition: {digestItem.digest.composition_meta.composition_mode ?? '—'} ·
                      components:{' '}
                      {(digestItem.digest.composition_meta.source_component_keys ?? []).join(', ') ||
                        '—'}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowSectionDebugJson((prev) => !prev)}
            >
              {showSectionDebugJson ? 'Скрыть JSON раздела' : 'Показать JSON раздела'}
            </Button>
          </div>

          {showSectionDebugJson ? (
            <pre className="debug-json-block__pre">
              {JSON.stringify(sectionPreview, null, 2)}
            </pre>
          ) : null}
        </Card>
      ) : null}

      {sectionInputAudit ? (
        <Card title="QA входа разделов">
          <dl className="info-list info-list--compact">
            <div className="info-list__row">
              <dt>Общий статус проверки входа</dt>
              <dd>
                <StatusBadge
                  status={auditStatusBadge(sectionInputAudit.overall_severity)}
                  label={auditOverallStatusLabel(sectionInputAudit.overall_severity)}
                />
              </dd>
            </div>
            <div className="info-list__row">
              <dt>Разделы карты талантов</dt>
              <dd>{sectionInputAudit.section_count}</dd>
            </div>
            <div className="info-list__row">
              <dt>OK / info / warning / error</dt>
              <dd>
                {sectionInputAudit.summary.ok} / {sectionInputAudit.summary.info} /{' '}
                {sectionInputAudit.summary.warning} / {sectionInputAudit.summary.error}
              </dd>
            </div>
          </dl>

          <div className="stack">
            <h4 className="bundle-coverage__subtitle">По разделам</h4>
            <ul className="compact-list">
              {sectionInputAudit.section_summaries.map((sectionSummary) => (
                <li
                  key={sectionSummary.section_key}
                  className="compact-list__item compact-list__item--static"
                >
                  <span className="compact-list__primary">{sectionSummary.section_title}</span>
                  <span className="compact-list__secondary">
                    {sectionSummary.total_selected} подготовленных источников ·{' '}
                    {sectionSummary.omitted_by_budget} отложено ·{' '}
                    {auditOverallStatusLabel(sectionSummary.severity)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {sectionInputAudit.issues.length > 0 ? (
            <div className="stack">
              <h4 className="bundle-coverage__subtitle">Замечания проверки входа</h4>
              {AUDIT_SEVERITY_ORDER.map((severity) => {
                const issues = groupedAuditIssues[severity]
                if (issues.length === 0) {
                  return null
                }

                return (
                  <div key={severity} className="stack">
                    <h5 className="bundle-coverage__subtitle">{AUDIT_SEVERITY_LABELS[severity]}</h5>
                    <ul className="compact-list">
                      {issues.map((issue, index) => (
                        <li
                          key={`${issue.check_id}:${issue.section_key ?? 'global'}:${index}`}
                          className="compact-list__item compact-list__item--static"
                        >
                          <span className="compact-list__primary">{issue.message}</span>
                          <span className="compact-list__secondary mono-text">
                            {issue.section_key ? `раздел ${issue.section_key}` : 'глобально'}
                            {issue.element_kind ? ` · ${issue.element_kind}` : ''}
                            {issue.element_key ? `/${issue.element_key}` : ''}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="city-autocomplete__hint">
              Подготовленные источники для разделов карты талантов прошли проверку входа без
              замечаний.
            </p>
          )}

          <div className="form-actions">
            <Button type="button" variant="ghost" onClick={() => setShowAuditJson((prev) => !prev)}>
              {showAuditJson ? 'Скрыть JSON проверки' : 'Показать JSON проверки'}
            </Button>
          </div>

          {showAuditJson ? (
            <pre className="debug-json-block__pre">
              {JSON.stringify(sectionInputAudit, null, 2)}
            </pre>
          ) : null}
        </Card>
      ) : null}

      {coverage ? (
        <Card title="Source bundle coverage">
          <dl className="info-list">
            <div className="info-list__row">
              <dt>Всего элементов</dt>
              <dd>{coverage.total_elements}</dd>
            </div>
            <div className="info-list__row">
              <dt>Найдено расшифровок</dt>
              <dd>{coverage.matched_elements}</dd>
            </div>
            <div className="info-list__row">
              <dt>Не найдено</dt>
              <dd>{coverage.missing_elements}</dd>
            </div>
            <div className="info-list__row">
              <dt>Coverage</dt>
              <dd>{coverage.coverage_percent}%</dd>
            </div>
          </dl>

          {Object.keys(coverage.by_kind).length > 0 ? (
            <div className="bundle-coverage__by-kind">
              <h4 className="bundle-coverage__subtitle">By kind coverage</h4>
              <ul className="bundle-coverage__kind-list">
                {Object.entries(coverage.by_kind)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([kind, stats]) => (
                    <li key={kind} className="bundle-coverage__kind-item">
                      <span className="bundle-coverage__kind-name">{kind}</span>
                      <span className="bundle-coverage__kind-stats">
                        {stats.matched}/{stats.total} matched, {stats.missing} missing
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          ) : null}
        </Card>
      ) : null}

      {bundle?.missing_items.length ? (
        <Card title="Missing items">
          <ul className="bundle-missing__list">
            {bundle.missing_items.map((item) => (
              <li key={`${item.element_kind}:${item.element_key}`} className="bundle-missing__item">
                <span className="mono-text">
                  {item.element_kind}/{item.element_key}
                </span>
                {item.element_label ? (
                  <span className="bundle-missing__label"> — {item.element_label}</span>
                ) : null}
                <span className="bundle-missing__reason"> ({item.reason})</span>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {sourceQualitySummary ? (
        <Card title="Source quality summary">
          <ul className="compact-list">
            {[...sourceQualitySummary.entries()].map(([quality, count]) => (
              <li key={quality} className="compact-list__item compact-list__item--static">
                <span className="compact-list__primary">{quality}</span>
                <span className="compact-list__secondary">{count}</span>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <div className="foundations-controls">
        <div className="sub-tabs sub-tabs--bar" role="tablist" aria-label="Фильтры">
          <button
            type="button"
            className={['sub-tabs__tab', viewMode === 'all' ? 'sub-tabs__tab--active' : '']
              .filter(Boolean)
              .join(' ')}
            onClick={() => setViewMode('all')}
          >
            Все
          </button>
          <button
            type="button"
            className={['sub-tabs__tab', viewMode === 'problems' ? 'sub-tabs__tab--active' : '']
              .filter(Boolean)
              .join(' ')}
            onClick={() => setViewMode('problems')}
          >
            Только проблемы
          </button>
        </div>

        <div className="sub-tabs sub-tabs--bar" role="tablist" aria-label="Режим контента">
          <button
            type="button"
            className={['sub-tabs__tab', contentMode === 'base' ? 'sub-tabs__tab--active' : '']
              .filter(Boolean)
              .join(' ')}
            onClick={() => setContentMode('base')}
          >
            Base
          </button>
          <button
            type="button"
            className={['sub-tabs__tab', contentMode === 'pro' ? 'sub-tabs__tab--active' : '']
              .filter(Boolean)
              .join(' ')}
            onClick={() => setContentMode('pro')}
          >
            Pro
          </button>
        </div>

        <label className="foundations-controls__select">
          <span className="input-field__label">По типам элементов</span>
          <select
            className="input-field__input"
            value={kindFilter}
            onChange={(event) => setKindFilter(event.target.value)}
          >
            <option value="all">Все типы</option>
            {ELEMENT_KINDS.map((kind) => (
              <option key={kind} value={kind}>
                {kind}
              </option>
            ))}
          </select>
        </label>

        <Button type="button" variant="ghost" onClick={() => setShowJson((prev) => !prev)}>
          {showJson ? 'Скрыть JSON' : 'Показать JSON'}
        </Button>
      </div>

      {Object.entries(ELEMENT_UI_GROUPS).map(([groupName, kinds]) => {
        const groupItems = [...groupedByKind.entries()].filter(([kind]) =>
          (kinds as readonly string[]).includes(kind),
        )

        if (groupItems.length === 0) {
          return null
        }

        return (
          <Card key={groupName} title={`Element Library · ${groupName}`}>
            <div className="stack">
              {groupItems.map(([kind, items]) => (
                <div key={kind} className="element-library-group">
                  <h4 className="element-library-group__title">{kind}</h4>
                  <ul className="compact-list">
                    {items.map((item) => (
                      <li key={item.element.id} className="compact-list__item">
                        <button
                          type="button"
                          className="compact-list__button"
                          onClick={() =>
                            setDrawerSelection({
                              elementKind: item.element.element_kind,
                              elementKey: item.element.element_key,
                              label: item.element.element_label ?? item.element.element_key,
                            })
                          }
                        >
                          <span className="compact-list__primary">
                            {item.element.element_label ?? item.element.element_key}
                          </span>
                          <span className="compact-list__secondary mono-text">
                            {item.element.element_kind}/{item.element.element_key}
                          </span>
                        </button>
                        <StatusBadge
                          status={item.matched ? 'ready' : 'error'}
                          label={item.matched ? 'matched' : 'missing'}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>
        )
      })}

      {synthesisPreview && !sectionFilter ? (
        <Card title="Подготовленные источники по разделам карты талантов">
          <ul className="synthesis-layer-list__items">
            {synthesisPreview.sections.map((section) => (
              <li key={section.section_key} className="synthesis-layer-list__item">
                <div className="synthesis-layer-list__header">
                  <span className="synthesis-layer-list__title">{section.section_title}</span>
                  <span className="synthesis-layer-list__stats">
                    {section.budget_summary.total_selected} выбрано ·{' '}
                    {section.budget_summary.omitted_count} отложено
                  </span>
                </div>
                <p className="city-autocomplete__hint">
                  {section.budget_summary.primary_selected} primary ·{' '}
                  {section.budget_summary.supporting_selected} supporting ·{' '}
                  {section.budget_summary.context_selected} context · ~{' '}
                  {section.budget_summary.total_digest_chars.toLocaleString('ru-RU')} симв.
                </p>
                <div className="form-actions">
                  <Button
                    variant="secondary"
                    to={`/app/candidate/foundations?section=${section.section_key}`}
                  >
                    Основания раздела
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {showJson && bundle ? (
        <Card title="Raw JSON">
          <pre className="debug-json-block__pre">{JSON.stringify(bundle, null, 2)}</pre>
        </Card>
      ) : null}
    </div>
  )
}
