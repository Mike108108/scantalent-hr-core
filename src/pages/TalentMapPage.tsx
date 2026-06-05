import { useEffect, useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import {
  getFirstCandidateForCompany,
  getOrCreateCompanyForCurrentUser,
} from '../lib/hrApi'
import type { Candidate } from '../lib/types'

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'empty' }
  | { status: 'ready'; candidate: Candidate }

export function TalentMapPage() {
  const [state, setState] = useState<PageState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const company = await getOrCreateCompanyForCurrentUser()
        const candidate = await getFirstCandidateForCompany(company.id)

        if (!cancelled) {
          if (!candidate) {
            setState({ status: 'empty' })
          } else {
            setState({ status: 'ready', candidate })
          }
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            status: 'error',
            message: error instanceof Error ? error.message : 'Не удалось загрузить данные.',
          })
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [])

  if (state.status === 'loading') {
    return (
      <div className="page-loading" role="status" aria-live="polite">
        <span className="spinner" aria-hidden="true" />
        <span>Загрузка…</span>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="stack">
        <div>
          <h1 className="page-title">Карта талантов</h1>
        </div>
        <div className="alert alert--error" role="alert">
          {state.message}
        </div>
      </div>
    )
  }

  if (state.status === 'empty') {
    return (
      <div className="stack">
        <div>
          <h1 className="page-title">Карта талантов</h1>
        </div>
        <Card>
          <div className="empty-state stack">
            <p>Сначала добавьте кандидата</p>
            <div className="form-actions">
              <Button to="/app/candidate">Добавить кандидата</Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  const { candidate } = state

  return (
    <div className="stack">
      <div>
        <h1 className="page-title">Карта талантов кандидата</h1>
        <p className="page-subtitle">Placeholder — генерация будет на следующем этапе</p>
      </div>

      <Card title="Карта талантов кандидата">
        <div className="stack">
          <dl className="info-list">
            <div className="info-list__row">
              <dt>Кандидат</dt>
              <dd>{candidate.name}</dd>
            </div>
            <div className="info-list__row">
              <dt>Техническая карта</dt>
              <dd>ещё не рассчитана</dd>
            </div>
            <div className="info-list__row">
              <dt>AI-карта талантов</dt>
              <dd>ещё не создана</dd>
            </div>
          </dl>

          <div className="empty-state">
            <p>
              <strong>Следующий этап:</strong>
            </p>
            <ol>
              <li>рассчитать техническую карту</li>
              <li>разложить карту на элементы</li>
              <li>создать HR-слои</li>
              <li>собрать карту талантов</li>
            </ol>
          </div>

          <div className="form-actions">
            <Button variant="secondary" to="/app/candidate">
              К данным кандидата
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
