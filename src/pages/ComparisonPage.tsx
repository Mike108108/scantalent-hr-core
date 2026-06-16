import { useEffect, useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import {
  getFirstCandidateForCompany,
  getOrCreateCompanyForCurrentUser,
} from '../lib/hrApi'
import type { Candidate } from '../lib/types'

type ComparisonTab = 'new' | 'history'

export function ComparisonPage() {
  const [activeTab, setActiveTab] = useState<ComparisonTab>('new')
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const company = await getOrCreateCompanyForCurrentUser()
        const loaded = await getFirstCandidateForCompany(company.id)
        if (!cancelled) {
          setCandidate(loaded)
        }
      } catch {
        if (!cancelled) {
          setCandidate(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="stack">
      <div>
        <h1 className="page-title">Сравнение</h1>
        <p className="page-subtitle">Сопоставление кандидатов с вакансиями</p>
      </div>

      <nav className="workspace-tabs" aria-label="Разделы сравнения">
        <button
          type="button"
          className={[
            'workspace-tabs__tab',
            activeTab === 'new' ? 'workspace-tabs__tab--active' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => setActiveTab('new')}
        >
          Новая проверка
        </button>
        <button
          type="button"
          className={[
            'workspace-tabs__tab',
            activeTab === 'history' ? 'workspace-tabs__tab--active' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => setActiveTab('history')}
        >
          История сравнений
        </button>
      </nav>

      {activeTab === 'new' ? (
        <div className="stack">
          <div className="grid-2">
            <Card title="Кандидат">
              {loading ? (
                <p className="city-autocomplete__hint">Загрузка…</p>
              ) : candidate ? (
                <p>{candidate.name}</p>
              ) : (
                <p className="empty-state">Выберите кандидата</p>
              )}
            </Card>
            <Card title="Вакансия">
              <p className="empty-state">Выберите вакансию</p>
            </Card>
          </div>

          <div className="form-actions">
            <Button type="button" disabled>
              Сравнить
            </Button>
          </div>

          <p className="city-autocomplete__hint">
            Сравнение кандидата с вакансией будет использовать готовые разделы карты талантов.
            Если нужные разделы не собраны, система предложит собрать их перед сравнением.
          </p>
        </div>
      ) : (
        <Card>
          <div className="empty-state stack">
            <p>История сравнений пока пустая.</p>
            <p>После сравнения кандидатов с вакансиями здесь появятся отчёты.</p>
          </div>
        </Card>
      )}
    </div>
  )
}
