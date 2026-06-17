import { useState } from 'react'
import { findBundleItem, readActivationComposition } from '../../../lib/chartDataHelpers'
import { useCandidateWorkspace } from '../CandidateWorkspaceContext'
import { Card } from '../../ui/Card'
import { StatusBadge } from '../../ui/StatusBadge'

type TechnicalSubTab = 'passport' | 'centers' | 'channels' | 'gates' | 'activations'

const subTabs: Array<{ key: TechnicalSubTab; label: string }> = [
  { key: 'passport', label: 'Паспорт' },
  { key: 'centers', label: 'Центры' },
  { key: 'channels', label: 'Каналы' },
  { key: 'gates', label: 'Ворота' },
  { key: 'activations', label: 'Активации' },
]

export function TechnicalMapTab() {
  const { normalizedChart, displayElementCounts, chartUiStatus, bundleResult, setDrawerSelection } =
    useCandidateWorkspace()
  const [activeSubTab, setActiveSubTab] = useState<TechnicalSubTab>('passport')

  const chartReady = chartUiStatus === 'calculated' && normalizedChart

  if (!chartReady) {
    return (
      <Card>
        <p className="empty-state">Техническая карта ещё не рассчитана. Рассчитайте карту на вкладке «Обзор».</p>
      </Card>
    )
  }

  const bundleItems = bundleResult?.bundle?.items

  return (
    <div className="stack workspace-sections">
      <nav className="sub-tabs sub-tabs--bar" aria-label="Разделы технической карты">
        {subTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={[
              'sub-tabs__tab',
              activeSubTab === tab.key ? 'sub-tabs__tab--active' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => setActiveSubTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeSubTab === 'passport' ? (
        <Card title="Паспорт">
          <dl className="info-list">
            <div className="info-list__row">
              <dt>Тип</dt>
              <dd>{normalizedChart.type ?? '—'}</dd>
            </div>
            <div className="info-list__row">
              <dt>Стратегия</dt>
              <dd>{normalizedChart.strategy ?? '—'}</dd>
            </div>
            <div className="info-list__row">
              <dt>Авторитет</dt>
              <dd>{normalizedChart.authority ?? '—'}</dd>
            </div>
            <div className="info-list__row">
              <dt>Профиль</dt>
              <dd>{normalizedChart.profile ?? '—'}</dd>
            </div>
            <div className="info-list__row">
              <dt>Определение</dt>
              <dd>{normalizedChart.definition ?? '—'}</dd>
            </div>
          </dl>

          <h3 className="card__subtitle">Технические счётчики</h3>
          <dl className="info-list">
            <div className="info-list__row">
              <dt>Определённые центры</dt>
              <dd>{displayElementCounts?.defined_centers ?? normalizedChart.centers.defined.length}</dd>
            </div>
            <div className="info-list__row">
              <dt>Открытые центры</dt>
              <dd>{displayElementCounts?.open_centers ?? normalizedChart.centers.open.length}</dd>
            </div>
            <div className="info-list__row">
              <dt>Каналы</dt>
              <dd>{displayElementCounts?.channels ?? normalizedChart.channels.length}</dd>
            </div>
            <div className="info-list__row">
              <dt>Ворота</dt>
              <dd>{displayElementCounts?.gates ?? normalizedChart.gates.length}</dd>
            </div>
            <div className="info-list__row">
              <dt>Активации</dt>
              <dd>{displayElementCounts?.activations ?? normalizedChart.activations.length}</dd>
            </div>
          </dl>
        </Card>
      ) : null}

      {activeSubTab === 'centers' ? (
        <div className="grid-2">
          <Card title="Определённые центры">
            {normalizedChart.centers.defined.length === 0 ? (
              <p className="empty-state">Нет определённых центров.</p>
            ) : (
              <ul className="element-chip-grid">
                {normalizedChart.centers.defined.map((center) => (
                  <li key={center.key}>
                    <button
                      type="button"
                      className="element-chip"
                      onClick={() =>
                        setDrawerSelection({
                          elementKind: 'defined_center',
                          elementKey: center.key,
                          label: center.label,
                        })
                      }
                    >
                      {center.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card title="Открытые центры">
            {normalizedChart.centers.open.length === 0 ? (
              <p className="empty-state">Нет открытых центров.</p>
            ) : (
              <ul className="element-chip-grid">
                {normalizedChart.centers.open.map((center) => (
                  <li key={center.key}>
                    <button
                      type="button"
                      className="element-chip"
                      onClick={() =>
                        setDrawerSelection({
                          elementKind: 'open_center',
                          elementKey: center.key,
                          label: center.label,
                        })
                      }
                    >
                      {center.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      ) : null}

      {activeSubTab === 'channels' ? (
        <Card title="Каналы">
          {normalizedChart.channels.length === 0 ? (
            <p className="empty-state">Каналы не найдены.</p>
          ) : (
            <ul className="compact-list">
              {normalizedChart.channels.map((channel) => (
                <li key={channel.key} className="compact-list__item">
                  <button
                    type="button"
                    className="compact-list__button"
                    onClick={() =>
                      setDrawerSelection({
                        elementKind: 'channel',
                        elementKey: channel.key,
                        label: channel.label ?? channel.key,
                      })
                    }
                  >
                    <span className="compact-list__primary">{channel.label ?? channel.key}</span>
                    {channel.gates.length > 0 ? (
                      <span className="compact-list__secondary mono-text">
                        {channel.gates.join(' · ')}
                      </span>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      ) : null}

      {activeSubTab === 'gates' ? (
        <Card title="Ворота">
          {normalizedChart.gates.length === 0 ? (
            <p className="empty-state">Ворота не найдены.</p>
          ) : (
            <ul className="compact-list compact-list--dense">
              {normalizedChart.gates.map((gate) => (
                <li key={gate.key} className="compact-list__item">
                  <button
                    type="button"
                    className="compact-list__button"
                    onClick={() =>
                      setDrawerSelection({
                        elementKind: 'gate',
                        elementKey: gate.key,
                        label: gate.label ?? gate.key,
                      })
                    }
                  >
                    <span className="compact-list__primary">{gate.label ?? gate.key}</span>
                    <span className="compact-list__secondary mono-text">
                      {[gate.line, gate.planet, gate.side].filter(Boolean).join(' · ') || '—'}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      ) : null}

      {activeSubTab === 'activations' ? (
        <Card title="Активации">
          {normalizedChart.activations.length === 0 ? (
            <p className="empty-state">Активации не найдены.</p>
          ) : (
            <div className="activation-table-wrap">
              <table className="activation-table">
                <thead>
                  <tr>
                    <th>planet</th>
                    <th>side</th>
                    <th>gate</th>
                    <th>line</th>
                    <th>activation_role</th>
                    <th>composition_mode</th>
                    <th>source_quality</th>
                    <th>matched</th>
                  </tr>
                </thead>
                <tbody>
                  {normalizedChart.activations.map((activation) => {
                    const bundleItem = findBundleItem(bundleItems, 'activation', activation.key)
                    const composition = readActivationComposition(bundleItem)

                    return (
                      <tr key={activation.key}>
                        <td>{activation.planet ?? '—'}</td>
                        <td>{activation.side ?? '—'}</td>
                        <td>{activation.gate ?? '—'}</td>
                        <td>{activation.line ?? '—'}</td>
                        <td className="mono-text">{composition.activationRole ?? '—'}</td>
                        <td className="mono-text">{composition.compositionMode ?? '—'}</td>
                        <td>{composition.sourceQuality ?? '—'}</td>
                        <td>
                          {bundleItem ? (
                            <StatusBadge
                              status={composition.matched ? 'ready' : 'error'}
                              label={composition.matched ? 'да' : 'нет'}
                            />
                          ) : (
                            '—'
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      ) : null}
    </div>
  )
}
