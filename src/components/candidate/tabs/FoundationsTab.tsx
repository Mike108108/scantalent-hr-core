import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ELEMENT_KINDS, ELEMENT_UI_GROUPS } from '../../../lib/elementKnowledgeBaseContract'
import { MVP_TALENT_MAP_SECTIONS } from '../../../lib/talentMapSections'
import { useCandidateWorkspace } from '../CandidateWorkspaceContext'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { StatusBadge } from '../../ui/StatusBadge'

type ViewMode = 'all' | 'problems'
type ContentMode = 'base' | 'pro'

export function FoundationsTab() {
  const {
    bundleResult,
    bundleLoading,
    bundleError,
    synthesisPreview,
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

  const sectionTitle = MVP_TALENT_MAP_SECTIONS.find((s) => s.key === sectionFilter)?.title

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

      {sectionTitle ? (
        <p className="city-autocomplete__hint">Фильтр по разделу: {sectionTitle}</p>
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

      {synthesisPreview ? (
        <Card title="Source preview по разделам карты">
          <ul className="synthesis-layer-list__items">
            {synthesisPreview.layers.map((layer) => (
              <li key={layer.layer_key} className="synthesis-layer-list__item">
                <div className="synthesis-layer-list__header">
                  <span className="synthesis-layer-list__title">{layer.layer_title}</span>
                  <span className="synthesis-layer-list__stats">
                    source_items: {layer.source_items.length}
                  </span>
                </div>
                {contentMode === 'base' ? (
                  <p className="city-autocomplete__hint">
                    Base preview: {layer.source_items.filter((i) => i.matched).length} matched
                    sources
                  </p>
                ) : (
                  <p className="city-autocomplete__hint">
                    Pro preview: {layer.source_chips.length} source chips
                  </p>
                )}
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
