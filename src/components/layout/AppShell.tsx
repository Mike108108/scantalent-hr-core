import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import { getSupabaseEnvStatus } from '../../lib/env'
import { Sidebar } from './Sidebar'

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
      <header className="app-header app-header--compact">
        <div className="app-header__inner">
          <a href="/" className="app-brand">
            ScanTalent
          </a>
        </div>
      </header>

      <div className="app-body">
        {isAuthenticated ? <Sidebar onSignOut={() => void handleSignOut()} /> : null}

        <div className="app-content">
          <main className="app-main">
            {!envStatus.configured && envStatus.warning ? (
              <div className="env-banner" role="status">
                {envStatus.warning}
              </div>
            ) : null}
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
