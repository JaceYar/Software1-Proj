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
                <div key={item.itemId} style={styles.cartItem}>
                  <span>{item.name}</span>
                  <span>x{item.quantity}</span>
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
  page: { maxWidth: '1100px', margin: '0 auto', padding: '2rem' },
  heading: { color: '#1a1a2e', marginBottom: '1.5rem' },
  error: { background: '#fee', color: '#c00', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' },
  success: { background: '#efe', color: '#060', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' },
  sectionTitle: { color: '#1a1a2e', marginBottom: '1rem', fontSize: '1.1rem' },
  products: {},
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' },
  card: {
    background: '#fff', borderRadius: '8px', padding: '1rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  category: { fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', marginBottom: '0.25rem' },
  productName: { fontWeight: 'bold', marginBottom: '0.25rem' },
  desc: { color: '#666', fontSize: '0.8rem', marginBottom: '0.5rem' },
  cardFooter: { display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' },
  price: { fontWeight: 'bold', color: '#1a1a2e' },
  stock: { color: '#888', fontSize: '0.75rem' },
  addBtn: {
    marginLeft: 'auto', padding: '0.3rem 0.75rem', background: '#e0c06e', color: '#1a1a2e',
    border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold',
  },
  cartPanel: {
    background: '#fff', borderRadius: '8px', padding: '1.25rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)', alignSelf: 'start', position: 'sticky', top: '1rem',
  },
  cartItem: {
    display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0',
    borderBottom: '1px solid #eee', fontSize: '0.875rem',
  },
  cartTotal: { fontWeight: 'bold', marginTop: '0.75rem', marginBottom: '1rem' },
  checkoutBtn: {
    width: '100%', padding: '0.75rem', background: '#1a1a2e', color: '#fff',
    border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem',
  },
};
