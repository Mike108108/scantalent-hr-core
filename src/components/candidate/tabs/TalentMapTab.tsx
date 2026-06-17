import { useCandidateWorkspace } from '../CandidateWorkspaceContext'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { StatusBadge } from '../../ui/StatusBadge'
import {
  MVP_TALENT_MAP_SECTIONS,
  type TalentMapSectionStatus,
} from '../../../lib/talentMapSections'
import type { SectionGenerationStatus } from '../../../lib/talentMapSectionTypes'

function statusBadgeVariant(status: SectionGenerationStatus | TalentMapSectionStatus) {
  switch (status) {
    case 'ready':
    case 'input_ready':
      return 'ready' as const
    case 'error':
    case 'failed':
    case 'input_not_ready':
      return 'error' as const
    case 'needs_update':
    case 'stale':
    case 'generating':
      return 'processing' as const
    default:
      return 'draft' as const
  }
}

export function TalentMapTab() {
  const { bundleResult, synthesisPreview } = useCandidateWorkspace()

  const collectedCount = 0
  const totalSections = MVP_TALENT_MAP_SECTIONS.length

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

      <div className="talent-section-grid">
        {MVP_TALENT_MAP_SECTIONS.map((section) => {
          const sectionPreview = synthesisPreview?.sections.find(
            (item) => item.section_key === section.key,
          )

          const generationStatus: SectionGenerationStatus =
            sectionPreview?.generation_status ?? 'not_generated'
          const userStatus = sectionPreview?.user_status_label ?? 'Ещё не собран'

          const budget = sectionPreview?.budget_summary
          const sourcesReady = budget?.total_selected ?? bundleResult?.coverage?.matched_elements ?? 0

          return (
            <Card key={section.key} className="talent-section-card">
              <div className="stack">
                <div className="talent-section-card__header">
                  <h3 className="talent-section-card__title">{section.title}</h3>
                  <StatusBadge
                    status={statusBadgeVariant(generationStatus)}
                    label={userStatus}
                  />
                </div>
                <p className="talent-section-card__description">{section.description}</p>
                <dl className="info-list info-list--compact">
                  <div className="info-list__row">
                    <dt>Подготовка входа</dt>
                    <dd>
                      {generationStatus === 'input_ready'
                        ? 'Готово к будущей сборке'
                        : generationStatus === 'input_not_ready'
                          ? 'Вход не готов'
                          : 'Ожидает данных карты'
                      }
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
                    <dt>Стоимость</dt>
                    <dd>{section.creditCost} токен</dd>
                  </div>
                  <div className="info-list__row">
                    <dt>Сложность сборки</dt>
                    <dd>{section.compute_weight}</dd>
                  </div>
                </dl>
                <div className="form-actions">
                  <Button type="button" disabled>
                    Собрать раздел
                  </Button>
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
