import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="flex items-center justify-between px-10 py-4 bg-surface-variant/60 backdrop-blur-[20px] sticky top-0 z-50">
      <Link to="/" className="text-primary font-serif font-bold text-lg no-underline tracking-tight">
        Stay &amp; Shop
      </Link>
      <div className="flex items-center gap-6">
        {user ? (
          <>
            <Link to="/rooms" className="text-on-surface-muted no-underline text-xs font-semibold uppercase tracking-[0.08rem] hover:text-on-surface transition-colors">Rooms</Link>
            {user.role === 'GUEST' && (
              <>
                <Link to="/reservations" className="text-on-surface-muted no-underline text-xs font-semibold uppercase tracking-[0.08rem] hover:text-on-surface transition-colors">My Reservations</Link>
                <Link to="/store" className="text-on-surface-muted no-underline text-xs font-semibold uppercase tracking-[0.08rem] hover:text-on-surface transition-colors">Store</Link>
              </>
            )}
            {(user.role === 'CLERK' || user.role === 'ADMIN') && (
              <Link to="/clerk" className="text-on-surface-muted no-underline text-xs font-semibold uppercase tracking-[0.08rem] hover:text-on-surface transition-colors">Clerk Dashboard</Link>
            )}
            {user.role === 'ADMIN' && (
              <Link to="/admin" className="text-on-surface-muted no-underline text-xs font-semibold uppercase tracking-[0.08rem] hover:text-on-surface transition-colors">Admin</Link>
            )}
            <span className="text-on-surface text-xs font-medium">{user.name} ({user.role})</span>
            <button
              onClick={handleLogout}
              className="bg-linear-to-br from-primary to-primary-container text-white border-0 px-4 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-[0.08rem] cursor-pointer font-sans"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-on-surface-muted no-underline text-xs font-semibold uppercase tracking-[0.08rem] hover:text-on-surface transition-colors">Login</Link>
            <Link to="/register" className="text-on-surface-muted no-underline text-xs font-semibold uppercase tracking-[0.08rem] hover:text-on-surface transition-colors">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
