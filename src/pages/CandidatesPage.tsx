import { useEffect, useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/StatusBadge'
import {
  getFirstCandidateForCompany,
  getLatestChartForCandidate,
  getOrCreateCompanyForCurrentUser,
} from '../lib/hrApi'
import type { Candidate, Company } from '../lib/types'

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; company: Company; candidate: Candidate | null; hasChart: boolean }

export function CandidatesPage() {
  const [state, setState] = useState<LoadState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const company = await getOrCreateCompanyForCurrentUser()
        const candidate = await getFirstCandidateForCompany(company.id)
        let hasChart = false

        if (candidate) {
          const chart = await getLatestChartForCandidate(candidate.id)
          hasChart = Boolean(chart)
        }

        if (!cancelled) {
          setState({ status: 'ready', company, candidate, hasChart })
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            status: 'error',
            message: error instanceof Error ? error.message : 'Не удалось загрузить кандидатов.',
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
        <span>Загрузка кандидатов…</span>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="stack">
        <div>
          <h1 className="page-title">Кандидаты</h1>
          <p className="page-subtitle">Список кандидатов компании</p>
        </div>
        <div className="alert alert--error" role="alert">
          {state.message}
        </div>
      </div>
    )
  }

  const { candidate, hasChart } = state

  return (
    <div className="stack">
      <div>
        <h1 className="page-title">Кандидаты</h1>
        <p className="page-subtitle">Список кандидатов компании</p>
      </div>

      {!candidate ? (
        <Card>
          <div className="empty-state stack">
            <p>Кандидаты пока не добавлены.</p>
            <div className="form-actions">
              <Button to="/app/candidate">Добавить кандидата</Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card>
          <ul className="candidate-list">
            <li className="candidate-list__item">
              <div className="candidate-list__info">
                <span className="candidate-list__name">{candidate.name}</span>
                <span className="candidate-list__meta">
                  {hasChart ? (
                    <StatusBadge status="ready" label="техническая карта готова" />
                  ) : (
                    <StatusBadge status="draft" label="карта не рассчитана" />
                  )}
                </span>
              </div>
              <Button to="/app/candidate">Открыть</Button>
            </li>
          </ul>
        </Card>
      )}
    </div>
  )
}
