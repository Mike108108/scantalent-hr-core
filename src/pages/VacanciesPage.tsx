import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

export function VacanciesPage() {
  return (
    <div className="stack">
      <div>
        <h1 className="page-title">Вакансии</h1>
        <p className="page-subtitle">
          Здесь будут вакансии, с которыми можно сравнивать кандидатов.
        </p>
      </div>

      <Card>
        <div className="empty-state stack">
          <p>Пока вакансии не добавлены.</p>
          <div className="form-actions">
            <Button type="button" disabled>
              Добавить вакансию
            </Button>
          </div>
          <p className="city-autocomplete__hint">
            Создание вакансий будет добавлено на следующем этапе.
          </p>
        </div>
      </Card>
    </div>
  )
}
