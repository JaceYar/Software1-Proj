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

  if (loading) return <div className="max-w-6xl mx-auto px-8 py-10"><p className="text-on-surface-muted">Loading...</p></div>;

  return (
    <div className="max-w-6xl mx-auto px-8 py-10">
      <h1 className="font-serif text-on-surface tracking-tight mb-8">Hotel Store</h1>

      {error && <div className="bg-tertiary/8 text-tertiary px-4 py-3 rounded-lg mb-5">{error}</div>}
      {success && <div className="bg-primary/8 text-primary px-4 py-3 rounded-lg mb-5">{success}</div>}

      <div className="grid gap-10" style={{ gridTemplateColumns: '1fr 300px' }}>
        <div>
          <h2 className="font-serif text-on-surface text-xl font-medium mb-5">Products</h2>
          <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            {products.map((p) => (
              <div key={p.id} className="bg-surface-lowest rounded-2xl p-5 shadow-ambient">
                <div className="text-xs text-on-surface-muted uppercase tracking-[0.06rem] font-semibold mb-1.5">{p.category}</div>
                <div className="font-serif font-medium text-on-surface mb-1.5">{p.name}</div>
                {p.description && <p className="text-on-surface-muted text-xs mb-3 leading-relaxed">{p.description}</p>}
                <div className="flex items-center gap-2 flex-wrap pt-3">
                  <span className="font-serif font-semibold text-on-surface">${p.price.toFixed(2)}</span>
                  <span className="text-on-surface-muted text-xs">{p.stockQuantity} in stock</span>
                  <button
                    onClick={() => handleAdd(p.id)}
                    disabled={p.stockQuantity === 0}
                    className="ml-auto px-3.5 py-1.5 bg-linear-to-br from-secondary to-[#8a6e50] text-white border-0 rounded-xl text-xs font-semibold uppercase tracking-[0.06rem] cursor-pointer font-sans disabled:opacity-40"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-lowest rounded-2xl p-6 shadow-ambient self-start sticky top-20">
          <h2 className="font-serif text-on-surface text-xl font-medium mb-5">Cart</h2>
          {cart.length === 0 ? (
            <p className="text-on-surface-muted text-sm">Your cart is empty.</p>
          ) : (
            <>
              {cart.map((item, i) => (
                <div
                  key={item.itemId}
                  className={`flex justify-between py-3 text-sm text-on-surface ${i < cart.length - 1 ? 'border-b border-surface-container' : ''}`}
                >
                  <span>{item.name}</span>
                  <span className="text-on-surface-muted">x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="font-serif font-semibold text-on-surface mt-4 mb-5 pt-3 border-t border-surface-container">
                Total: ${cartTotal.toFixed(2)}
              </div>
              <button
                onClick={handleCheckout}
                className="w-full py-3.5 bg-linear-to-br from-primary to-primary-container text-white border-0 rounded-xl text-xs font-semibold uppercase tracking-[0.1rem] cursor-pointer font-sans"
              >
                Checkout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
