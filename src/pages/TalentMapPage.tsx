import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/StatusBadge'

const sections = [
  'Общая сводка',
  'Рабочий формат',
  'Таланты',
  'Рабочая среда',
  'Риски',
  'Управление',
  'Послойная расшифровка',
  'Pro-основание',
]

export function TalentMapPage() {
  return (
    <div className="stack">
      <div>
        <h1 className="page-title">Карта талантов</h1>
        <p className="page-subtitle">Placeholder карты талантов кандидата</p>
      </div>

      <Card title="Структура будущей карты">
        <div className="section-list">
          {sections.map((section) => (
            <div key={section} className="section-list__item">
              <span className="section-list__label">{section}</span>
              <StatusBadge status="draft" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
