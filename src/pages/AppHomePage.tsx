import { useEffect, useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/StatusBadge'
import {
  getFirstCandidateForCompany,
  getOrCreateCompanyForCurrentUser,
} from '../lib/hrApi'
import type { Candidate, Company } from '../lib/types'

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; company: Company; candidate: Candidate | null }

export function AppHomePage() {
  const [state, setState] = useState<LoadState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const company = await getOrCreateCompanyForCurrentUser()
        const candidate = await getFirstCandidateForCompany(company.id)

        if (!cancelled) {
          setState({ status: 'ready', company, candidate })
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
        <span>Загрузка компании…</span>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="stack">
        <div>
          <h1 className="page-title">Приложение</h1>
          <p className="page-subtitle">Главный экран ScanTalent HR Core</p>
        </div>
        <div className="alert alert--error" role="alert">
          {state.message}
        </div>
      </div>
    )
  }

  const { company, candidate } = state

  return (
    <div className="stack">
      <div>
        <h1 className="page-title">Приложение</h1>
        <p className="page-subtitle">Главный экран ScanTalent HR Core</p>
      </div>

      <Card title="Компания">
        <div className="stack">
          <dl className="info-list">
            <div className="info-list__row">
              <dt>Компания</dt>
              <dd>{company.name}</dd>
            </div>
            <div className="info-list__row">
              <dt>Статус</dt>
              <dd>
                <StatusBadge status="ready" label="подключена" />
              </dd>
            </div>
            <div className="info-list__row">
              <dt>Кандидат</dt>
              <dd>{candidate ? 'создан' : 'пока не создан'}</dd>
            </div>
          </dl>

          <div className="form-actions">
            <Button to="/app/candidate">Перейти к кандидату</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
