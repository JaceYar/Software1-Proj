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
    padding: '0.75rem 2rem', background: '#1a1a2e', color: '#fff',
  },
  brand: {
    color: '#e0c06e', fontWeight: 'bold', fontSize: '1.25rem', textDecoration: 'none',
  },
  links: { display: 'flex', alignItems: 'center', gap: '1rem' },
  link: { color: '#ccc', textDecoration: 'none', fontSize: '0.9rem' },
  username: { color: '#e0c06e', fontSize: '0.85rem' },
  button: {
    background: 'none', border: '1px solid #ccc', color: '#ccc',
    padding: '0.25rem 0.75rem', cursor: 'pointer', borderRadius: '4px',
    fontSize: '0.85rem',
  },
};
