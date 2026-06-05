import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/StatusBadge'

export function AppHomePage() {
  return (
    <div className="stack">
      <div>
        <h1 className="page-title">Приложение</h1>
        <p className="page-subtitle">Главный экран ScanTalent HR Core</p>
      </div>

      <Card title="Компания пока не создана">
        <div className="stack">
          <StatusBadge status="draft" label="Нет компании" />
          <div className="empty-state">
            <p>
              <strong>Следующий шаг:</strong>
            </p>
            <ol>
              <li>подключить Supabase</li>
              <li>создать компанию</li>
              <li>добавить кандидата</li>
            </ol>
          </div>
        </div>
      </Card>
    </div>
  )
}
