import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

export function LandingPage() {
  return (
    <div className="hero">
      <div>
        <h1 className="page-title">ScanTalent</h1>
        <p className="page-subtitle">Сканер талантов для HR</p>
      </div>

      <Card title="Минимальный HR Core">
        <p>1 компания → 1 кандидат → карта талантов</p>
      </Card>

      <div className="hero__actions">
        <Button to="/login">Войти</Button>
        <Button to="/signup" variant="secondary">
          Зарегистрироваться
        </Button>
        <Button to="/app" variant="ghost">
          Перейти в приложение
        </Button>
      </div>
    </div>
  )
}
