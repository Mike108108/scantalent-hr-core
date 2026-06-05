import { NavLink, Outlet } from 'react-router-dom'
import { getSupabaseEnvStatus } from '../../lib/env'

export function AppShell() {
  const envStatus = getSupabaseEnvStatus()

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__inner">
          <NavLink to="/" className="app-brand">
            ScanTalent
          </NavLink>
          <nav className="app-nav" aria-label="Основная навигация">
            <NavLink to="/login">Войти</NavLink>
            <NavLink to="/signup">Регистрация</NavLink>
            <NavLink to="/app">Приложение</NavLink>
            <NavLink to="/app/candidate">Кандидат</NavLink>
            <NavLink to="/app/candidate/talent-map">Карта талантов</NavLink>
          </nav>
        </div>
      </header>

      <main className="app-main">
        {!envStatus.configured && envStatus.warning ? (
          <div className="env-banner" role="status">
            {envStatus.warning}
          </div>
        ) : null}
        <Outlet />
      </main>
    </div>
  )
}
