import { NavLink, Outlet } from 'react-router-dom';
import { LayoutGrid, LogOut, Moon, Plus, Sparkles, SunMedium } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useDarkMode } from '../hooks/useDarkMode';

const ITEMS_NAV = [
  { to: '/', label: 'Armario', icon: LayoutGrid, end: true },
  { to: '/agregar', label: 'Agregar', icon: Plus, end: false },
  { to: '/looks', label: 'Estilista', icon: Sparkles, end: false },
];

export function Layout() {
  const { user, logout } = useAuth();
  const { tema, toggle } = useDarkMode();

  return (
    <div className="app-shell">
      <div className="bg-mesh" aria-hidden="true" />

      <header className="app-header">
        <div className="brand">
          <span className="brand-emoji">👔</span>
          <h1>Armario Virtual</h1>
        </div>

        <nav className="app-nav app-nav-desktop">
          {ITEMS_NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => (isActive ? 'active' : '')}>
              <Icon size={17} strokeWidth={2.2} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="header-user">
          <button className="icon-btn" onClick={toggle} aria-label="Cambiar tema" title="Cambiar tema">
            {tema === 'oscuro' ? <SunMedium size={18} /> : <Moon size={18} />}
          </button>
          {user?.photoURL ? (
            <img className="avatar" src={user.photoURL} alt="" referrerPolicy="no-referrer" />
          ) : (
            <div className="avatar avatar-fallback">{user?.displayName?.[0] ?? '?'}</div>
          )}
          <button className="icon-btn" onClick={() => logout()} aria-label="Salir" title="Salir">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <nav className="app-nav-mobile" aria-label="Navegación principal">
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? 'tab-mobile active' : 'tab-mobile')}
        >
          <LayoutGrid size={20} strokeWidth={2.2} />
          <span>Armario</span>
        </NavLink>

        <NavLink to="/agregar" className="tab-fab" aria-label="Agregar prenda" title="Agregar prenda">
          <Plus size={26} strokeWidth={2.4} />
        </NavLink>

        <NavLink
          to="/looks"
          className={({ isActive }) => (isActive ? 'tab-mobile active' : 'tab-mobile')}
        >
          <Sparkles size={20} strokeWidth={2.2} />
          <span>Estilista</span>
        </NavLink>
      </nav>
    </div>
  );
}
