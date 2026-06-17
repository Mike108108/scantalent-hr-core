import { Card } from '../components/ui/Card'

export function HelpPage() {
  return (
    <div className="stack">
      <div>
        <h1 className="page-title">Помощь</h1>
        <p className="page-subtitle">Справка по ScanTalent HR</p>
      </div>

      <Card>
        <div className="stack">
          <p>
            ScanTalent помогает HR-специалистам анализировать кандидатов через техническую карту
            Human Design и модульную карту талантов.
          </p>
          <ul>
            <li>Добавьте кандидата и рассчитайте техническую карту.</li>
            <li>Изучите техническую карту и основания.</li>
            <li>Соберите разделы карты талантов (на следующих этапах).</li>
            <li>Сравните кандидата с вакансией (на следующих этапах).</li>
          </ul>
        </div>
      </Card>
    </div>
  )
}
