import { Card } from '../components/ui/Card'

export function SettingsPage() {
  return (
    <div className="stack">
      <div>
        <h1 className="page-title">Настройки</h1>
        <p className="page-subtitle">Настройки HR-кабинета</p>
      </div>

      <Card>
        <div className="empty-state stack">
          <p>Раздел настроек будет расширен на следующих этапах.</p>
        </div>
      </Card>
    </div>
  )
}
