import { useMemo, useState } from 'react'
import { Drawer } from '../ui/Drawer'
import { StatusBadge } from '../ui/StatusBadge'
import { findBundleItem } from '../../lib/chartDataHelpers'
import { MVP_TALENT_MAP_SECTIONS } from '../../lib/talentMapSections'
import type { ReferenceBundleItem } from '../../lib/types'
import { useCandidateWorkspace } from './CandidateWorkspaceContext'

export type ElementDrawerSelection = {
  elementKind: string
  elementKey: string
  label: string
  usedInSections?: string[]
}

function resolveBundleItem(
  items: ReferenceBundleItem[] | undefined,
  selection: ElementDrawerSelection,
): ReferenceBundleItem | undefined {
  return findBundleItem(items, selection.elementKind, selection.elementKey)
}

export function ElementDrawer() {
  const { drawerSelection, setDrawerSelection, bundleResult } = useCandidateWorkspace()
  const [contentTab, setContentTab] = useState<'base' | 'pro'>('base')

  const bundleItem = useMemo(
    () =>
      drawerSelection
        ? resolveBundleItem(bundleResult?.bundle?.items, drawerSelection)
        : undefined,
    [drawerSelection, bundleResult?.bundle?.items],
  )

  const interpretation = bundleItem?.interpretation

  return (
    <Drawer
      open={Boolean(drawerSelection)}
      title={drawerSelection?.label ?? 'Элемент'}
      onClose={() => setDrawerSelection(null)}
    >
      {drawerSelection ? (
        <div className="stack">
          <dl className="info-list">
            <div className="info-list__row">
              <dt>element_kind</dt>
              <dd className="mono-text">{drawerSelection.elementKind}</dd>
            </div>
            <div className="info-list__row">
              <dt>element_key</dt>
              <dd className="mono-text">{drawerSelection.elementKey}</dd>
            </div>
            <div className="info-list__row">
              <dt>source_quality</dt>
              <dd>{interpretation?.source_quality ?? '—'}</dd>
            </div>
            <div className="info-list__row">
              <dt>matched</dt>
              <dd>
                {bundleItem ? (
                  <StatusBadge
                    status={bundleItem.matched ? 'ready' : 'error'}
                    label={bundleItem.matched ? 'найдено' : 'не найдено'}
                  />
                ) : (
                  '—'
                )}
              </dd>
            </div>
          </dl>

          <div className="sub-tabs" role="tablist" aria-label="Режим просмотра">
            <button
              type="button"
              role="tab"
              aria-selected={contentTab === 'base'}
              className={['sub-tabs__tab', contentTab === 'base' ? 'sub-tabs__tab--active' : '']
                .filter(Boolean)
                .join(' ')}
              onClick={() => setContentTab('base')}
            >
              Base
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={contentTab === 'pro'}
              className={['sub-tabs__tab', contentTab === 'pro' ? 'sub-tabs__tab--active' : '']
                .filter(Boolean)
                .join(' ')}
              onClick={() => setContentTab('pro')}
            >
              Pro
            </button>
          </div>

          {contentTab === 'base' ? (
            <div className="drawer-content-block">
              <p className="drawer-content-block__text">
                {interpretation?.hr_translation_markdown ??
                  interpretation?.base_layers?.plain_meaning ??
                  'Base-описание пока недоступно.'}
              </p>
            </div>
          ) : (
            <div className="drawer-content-block">
              <p className="drawer-content-block__text">
                {interpretation?.pro_markdown ??
                  interpretation?.pro_layers?.plain_meaning ??
                  'Pro-описание пока недоступно.'}
              </p>
            </div>
          )}

          {bundleItem?.element.metadata_json &&
          Object.keys(bundleItem.element.metadata_json).length > 0 ? (
            <div className="drawer-content-block">
              <h3 className="drawer-content-block__title">metadata</h3>
              <pre className="debug-json-block__pre debug-json-block__pre--compact">
                {JSON.stringify(bundleItem.element.metadata_json, null, 2)}
              </pre>
            </div>
          ) : null}

          {interpretation?.pro_layers?.composition_components ? (
            <div className="drawer-content-block">
              <h3 className="drawer-content-block__title">composition components</h3>
              <ul className="chip-list">
                {(interpretation.pro_layers.composition_components as string[]).map((component) => (
                  <li key={component} className="chip-list__item mono-text">
                    {component}
                  </li>
                ))}
              </ul>
              {interpretation.pro_layers.composition_mode ? (
                <p className="city-autocomplete__hint">
                  composition_mode: {interpretation.pro_layers.composition_mode}
                </p>
              ) : null}
            </div>
          ) : null}

          {drawerSelection.usedInSections && drawerSelection.usedInSections.length > 0 ? (
            <div className="drawer-content-block">
              <h3 className="drawer-content-block__title">Где используется</h3>
              <ul className="chip-list">
                {drawerSelection.usedInSections.map((section) => (
                  <li key={section} className="chip-list__item">
                    {section}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </Drawer>
  )
}

export function sectionTitleByKey(key: string): string {
  return MVP_TALENT_MAP_SECTIONS.find((section) => section.key === key)?.title ?? key
}
