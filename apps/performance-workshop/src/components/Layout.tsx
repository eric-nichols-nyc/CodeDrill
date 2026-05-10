import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/elements', label: 'Elements' },
  { to: '/context', label: 'Context' },
  { to: '/concurrent-rendering', label: 'Concurrent Rendering' },
  { to: '/code-splitting', label: 'Code Splitting' },
  { to: '/calculations', label: 'Calculations' },
  { to: '/windowing', label: 'Windowing' },
  { to: '/rerenders', label: 'Rerenders' },
] as const

export function Layout() {
  return (
    <div className="layout">
      <aside className="sidenav">
        <nav className="sidenav-inner">
          <h2 className="sidenav-title">Performance Workshop</h2>
          <ul className="sidenav-list">
            {navItems.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `sidenav-link ${isActive ? 'sidenav-link--active' : ''}`
                  }
                  end={false}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}
