import { useCandidateWorkspace } from '../CandidateWorkspaceContext'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { StatusBadge } from '../../ui/StatusBadge'
import {
  MVP_TALENT_MAP_SECTIONS,
  SECTION_STATUS_LABELS,
  type TalentMapSectionStatus,
} from '../../../lib/talentMapSections'

function statusBadgeVariant(status: TalentMapSectionStatus) {
  switch (status) {
    case 'ready':
      return 'ready' as const
    case 'error':
      return 'error' as const
    case 'needs_update':
      return 'processing' as const
    default:
      return 'draft' as const
  }
}

export function TalentMapTab() {
  const { bundleResult, synthesisPreview } = useCandidateWorkspace()

  const collectedCount = 0
  const totalSections = MVP_TALENT_MAP_SECTIONS.length

  function sourcesReadyForSection(sectionKey: string): number {
    if (!synthesisPreview) {
      return bundleResult?.coverage?.matched_elements ?? 0
    }

    const layer = synthesisPreview.layers.find((item) => item.layer_key === sectionKey)
    if (layer) {
      return layer.source_items.filter((item) => item.matched).length
    }

    return bundleResult?.coverage?.matched_elements ?? 0
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
        Токены списываются только за выбранные разделы.
      </p>

      <div className="talent-section-grid">
        {MVP_TALENT_MAP_SECTIONS.map((section) => {
          const status: TalentMapSectionStatus = 'not_collected'
          const sourcesReady = sourcesReadyForSection(section.key)

          return (
            <Card key={section.key} className="talent-section-card">
              <div className="stack">
                <div className="talent-section-card__header">
                  <h3 className="talent-section-card__title">{section.title}</h3>
                  <StatusBadge
                    status={statusBadgeVariant(status)}
                    label={SECTION_STATUS_LABELS[status]}
                  />
                </div>
                <p className="talent-section-card__description">{section.description}</p>
                <dl className="info-list info-list--compact">
                  <div className="info-list__row">
                    <dt>Источники готовы</dt>
                    <dd>{sourcesReady}</dd>
                  </div>
                  <div className="info-list__row">
                    <dt>Стоимость</dt>
                    <dd>{section.tokenCost} токенов</dd>
                  </div>
                </dl>
                <div className="form-actions">
                  <Button
                    type="button"
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
