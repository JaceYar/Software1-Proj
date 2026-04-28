import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `no-underline text-xs font-semibold uppercase tracking-[0.08rem] transition-colors ${
      isActive ? 'text-primary' : 'text-on-surface-muted hover:text-on-surface'
    }`;

  return (
    <nav className="flex items-center justify-between px-10 py-4 bg-surface-variant/70 backdrop-blur-[20px] sticky top-0 z-50 border-b border-outline-variant/20">
      <NavLink to="/" className="text-primary font-serif font-bold text-lg no-underline tracking-tight">
        Artisanal Heritage
      </NavLink>
      <div className="flex items-center gap-5">
        <NavLink to="/rooms" className={linkClass}>Find Rooms</NavLink>
        {user ? (
          <>
            {user.role === 'GUEST' && (
              <>
                <NavLink to="/reservations" className={linkClass}>My Stay</NavLink>
                <NavLink to="/store" className={linkClass}>Store</NavLink>
              </>
            )}
            {(user.role === 'CLERK' || user.role === 'ADMIN') && (
              <NavLink to="/clerk" className={linkClass}>Clerk Portal</NavLink>
            )}
            {user.role === 'ADMIN' && (
              <NavLink to="/admin" className={linkClass}>Admin</NavLink>
            )}
            <span className="text-on-surface text-xs font-medium">{user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-linear-to-br from-primary to-primary-container text-white border-0 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-[0.08rem] cursor-pointer font-sans"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={linkClass}>Login</NavLink>
            <NavLink to="/register" className={linkClass}>Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
