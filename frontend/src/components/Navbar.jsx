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
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>Stay &amp; Shop</Link>
      <div style={styles.links}>
        {user ? (
          <>
            <Link to="/rooms" style={styles.link}>Rooms</Link>
            {user.role === 'GUEST' && (
              <>
                <Link to="/reservations" style={styles.link}>My Reservations</Link>
                <Link to="/store" style={styles.link}>Store</Link>
              </>
            )}
            {(user.role === 'CLERK' || user.role === 'ADMIN') && (
              <Link to="/clerk" style={styles.link}>Clerk Dashboard</Link>
            )}
            {user.role === 'ADMIN' && (
              <Link to="/admin" style={styles.link}>Admin</Link>
            )}
            <span style={styles.username}>{user.name} ({user.role})</span>
            <button onClick={handleLogout} style={styles.button}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '1rem 2.5rem',
    background: 'rgba(221, 229, 219, 0.6)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    position: 'sticky', top: 0, zIndex: 100,
  },
  brand: {
    color: '#18281e', fontWeight: '700', fontSize: '1.1rem', textDecoration: 'none',
    fontFamily: "'Noto Serif', Georgia, serif", letterSpacing: '-0.01em',
  },
  links: { display: 'flex', alignItems: 'center', gap: '1.5rem' },
  link: {
    color: '#737873', textDecoration: 'none', fontSize: '0.75rem',
    fontWeight: '600', letterSpacing: '0.08rem', textTransform: 'uppercase',
  },
  username: { color: '#18281e', fontSize: '0.75rem', fontWeight: '500' },
  button: {
    background: 'linear-gradient(135deg, #18281e, #2d3e33)', color: '#ffffff',
    border: 'none', padding: '0.4rem 1rem', cursor: 'pointer', borderRadius: '0.75rem',
    fontSize: '0.7rem', fontWeight: '600', letterSpacing: '0.08rem', textTransform: 'uppercase',
    fontFamily: "'Manrope', system-ui, sans-serif",
  },
};
