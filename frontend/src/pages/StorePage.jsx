import { useState, useEffect } from 'react';
import { getProducts, getCart, addToCart, checkout } from '../services/api';

export default function StorePage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = async () => {
    try {
      const [prodRes, cartRes] = await Promise.all([getProducts(), getCart()]);
      setProducts(prodRes.data);
      setCart(cartRes.data);
    } catch (err) {
      setError(err.response?.data || 'Failed to load store data. You must be checked in to shop.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleAdd = async (productId) => {
    setError('');
    try {
      await addToCart({ productId, quantity: 1 });
      loadData();
    } catch (err) {
      setError(err.response?.data || 'Could not add item');
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setError('');
    try {
      const res = await checkout();
      setSuccess(`Order placed! Total: $${res.data.total.toFixed(2)}`);
      loadData();
    } catch (err) {
      setError(err.response?.data || 'Checkout failed');
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) return <div style={styles.page}><p>Loading...</p></div>;

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Hotel Store</h1>
      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      <div style={styles.layout}>
        <div style={styles.products}>
          <h2 style={styles.sectionTitle}>Products</h2>
          <div style={styles.grid}>
            {products.map((p) => (
              <div key={p.id} style={styles.card}>
                <div style={styles.category}>{p.category}</div>
                <div style={styles.productName}>{p.name}</div>
                {p.description && <p style={styles.desc}>{p.description}</p>}
                <div style={styles.cardFooter}>
                  <span style={styles.price}>${p.price.toFixed(2)}</span>
                  <span style={styles.stock}>{p.stockQuantity} in stock</span>
                  <button
                    onClick={() => handleAdd(p.id)}
                    style={styles.addBtn}
                    disabled={p.stockQuantity === 0}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.cartPanel}>
          <h2 style={styles.sectionTitle}>Cart</h2>
          {cart.length === 0 ? (
            <p style={{ color: '#888' }}>Your cart is empty.</p>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.itemId} style={{ ...styles.cartItem, borderBottom: item !== cart[cart.length-1] ? '1px solid #f0eee9' : 'none' }}>
                  <span>{item.name}</span>
                  <span style={{ color: '#737873' }}>x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div style={styles.cartTotal}>Total: ${cartTotal.toFixed(2)}</div>
              <button onClick={handleCheckout} style={styles.checkoutBtn}>Checkout</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 2rem' },
  heading: {
    color: '#1b1c19', marginBottom: '2rem',
    fontFamily: "'Noto Serif', Georgia, serif", letterSpacing: '-0.02em',
  },
  error: {
    background: 'rgba(75,12,15,0.06)', color: '#4b0c0f',
    padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1.25rem',
  },
  success: {
    background: 'rgba(24,40,30,0.06)', color: '#18281e',
    padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1.25rem',
  },
  layout: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2.5rem' },
  sectionTitle: {
    color: '#1b1c19', marginBottom: '1.25rem',
    fontFamily: "'Noto Serif', Georgia, serif", fontSize: '1.25rem', fontWeight: '500',
  },
  products: {},
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' },
  card: {
    background: '#ffffff', borderRadius: '1rem', padding: '1.25rem',
    boxShadow: '0 20px 40px rgba(27, 28, 25, 0.06)',
  },
  category: {
    fontSize: '0.65rem', color: '#737873', textTransform: 'uppercase',
    marginBottom: '0.4rem', fontWeight: '600', letterSpacing: '0.06rem',
  },
  productName: {
    fontWeight: '500', marginBottom: '0.4rem',
    fontFamily: "'Noto Serif', Georgia, serif", color: '#1b1c19',
  },
  desc: { color: '#737873', fontSize: '0.8rem', marginBottom: '0.75rem', lineHeight: '1.5' },
  cardFooter: { display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.75rem' },
  price: {
    fontWeight: '600', color: '#1b1c19',
    fontFamily: "'Noto Serif', Georgia, serif",
  },
  stock: { color: '#737873', fontSize: '0.7rem' },
  addBtn: {
    marginLeft: 'auto', padding: '0.35rem 0.9rem',
    background: 'linear-gradient(135deg, #715a3e, #8a6e50)', color: '#ffffff',
    border: 'none', borderRadius: '0.75rem', cursor: 'pointer',
    fontSize: '0.65rem', fontWeight: '600', letterSpacing: '0.06rem', textTransform: 'uppercase',
    fontFamily: "'Manrope', system-ui, sans-serif",
  },
  cartPanel: {
    background: '#ffffff', borderRadius: '1rem', padding: '1.5rem',
    boxShadow: '0 20px 40px rgba(27, 28, 25, 0.06)', alignSelf: 'start', position: 'sticky', top: '5rem',
  },
  cartItem: {
    display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0',
    fontSize: '0.875rem', color: '#1b1c19',
  },
  cartTotal: {
    fontWeight: '600', marginTop: '1rem', marginBottom: '1.25rem',
    paddingTop: '0.75rem', color: '#1b1c19',
    fontFamily: "'Noto Serif', Georgia, serif",
  },
  checkoutBtn: {
    width: '100%', padding: '0.875rem',
    background: 'linear-gradient(135deg, #18281e, #2d3e33)', color: '#ffffff',
    border: 'none', borderRadius: '0.75rem', cursor: 'pointer',
    fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.1rem', textTransform: 'uppercase',
    fontFamily: "'Manrope', system-ui, sans-serif",
  },
};
