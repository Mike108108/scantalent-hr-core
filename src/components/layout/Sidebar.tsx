import { NavLink } from 'react-router-dom'
import { Button } from '../ui/Button'

type SidebarProps = {
  onSignOut: () => void
}

const mainNavItems = [
  { to: '/app/candidates', label: 'Кандидаты', end: false },
  { to: '/app/vacancies', label: 'Вакансии', end: true },
  { to: '/app/comparison', label: 'Сравнение', end: true },
  { to: '/app/settings', label: 'Настройки', end: true },
] as const

export function Sidebar({ onSignOut }: SidebarProps) {
  return (
    <aside className="app-sidebar" aria-label="Боковое меню">
      <nav className="app-sidebar__nav">
        {mainNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              ['app-sidebar__link', isActive ? 'app-sidebar__link--active' : '']
                .filter(Boolean)
                .join(' ')
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="app-sidebar__footer">
        <NavLink
          to="/app/help"
          className={({ isActive }) =>
            ['app-sidebar__link', 'app-sidebar__link--muted', isActive ? 'app-sidebar__link--active' : '']
              .filter(Boolean)
              .join(' ')
          }
        >
          Помощь
        </NavLink>
        <Button variant="ghost" className="app-sidebar__signout" onClick={onSignOut}>
          Выйти
        </Button>
      </div>
    </aside>
  )
}
