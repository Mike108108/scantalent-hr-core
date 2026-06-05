import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import { getSupabaseEnvStatus } from '../../lib/env'
import { Button } from '../ui/Button'

export function AppShell() {
  const envStatus = getSupabaseEnvStatus()
  const { session, signOut } = useAuth()
  const navigate = useNavigate()
  const isAuthenticated = Boolean(session)

  async function handleSignOut() {
    try {
      await signOut()
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('[ScanTalent] signOut failed:', error)
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__inner">
          <NavLink to="/" className="app-brand">
            ScanTalent
          </NavLink>
          <nav className="app-nav" aria-label="Основная навигация">
            {isAuthenticated ? (
              <>
                <NavLink to="/app">Приложение</NavLink>
                <NavLink to="/app/candidate">Кандидат</NavLink>
                <NavLink to="/app/candidate/talent-map">Карта талантов</NavLink>
                <Button variant="ghost" onClick={() => void handleSignOut()}>
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <NavLink to="/login">Войти</NavLink>
                <NavLink to="/signup">Регистрация</NavLink>
              </>
            )}
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
