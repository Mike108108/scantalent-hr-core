import { NavLink, Outlet } from 'react-router-dom'
import { ElementDrawer } from './ElementDrawer'
import { useCandidateWorkspace } from './CandidateWorkspaceContext'

const tabs = [
  { to: '/app/candidate', label: 'Обзор', end: true },
  { to: '/app/candidate/talent-map', label: 'Карта талантов', end: true },
  { to: '/app/candidate/technical-map', label: 'Техническая карта', end: true },
  { to: '/app/candidate/foundations', label: 'Основания', end: true },
] as const

export function CandidateWorkspaceLayout() {
  const { state } = useCandidateWorkspace()

  if (state.status === 'loading') {
    return (
      <div className="page-loading" role="status" aria-live="polite">
        <span className="spinner" aria-hidden="true" />
        <span>Загрузка кандидата…</span>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="stack">
        <div>
          <h1 className="page-title">Кандидат</h1>
          <p className="page-subtitle">Рабочее пространство кандидата</p>
        </div>
        <div className="alert alert--error" role="alert">
          {state.message}
        </div>
      </div>
    )
  }

  const candidateName = state.candidate?.name ?? 'Новый кандидат'

  return (
    <div className="candidate-workspace">
      <header className="candidate-workspace__header">
        <div>
          <h1 className="page-title">{candidateName}</h1>
          <p className="page-subtitle">Рабочее пространство кандидата</p>
        </div>
      </header>

      <nav className="workspace-tabs" aria-label="Разделы кандидата">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              ['workspace-tabs__tab', isActive ? 'workspace-tabs__tab--active' : '']
                .filter(Boolean)
                .join(' ')
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <div className="candidate-workspace__content">
        <Outlet />
      </div>

      <ElementDrawer />
    </div>
  )
}
