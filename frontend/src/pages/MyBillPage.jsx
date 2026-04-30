import { useEffect, useState } from 'react';
import { getMyLastStayBill, payEntireBill } from '../services/api';

export default function MyBillPage() {
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadBill = async () => {
      try {
        const res = await getMyLastStayBill();
        setBill(res.data);
      } catch (err) {
        setError(err.response?.data || 'Failed to load bill');
      } finally {
        setLoading(false);
      }
    };

    loadBill();
  }, []);

  const handlePayEntire = async () => {
    setError('');
    setSuccess('');
    try {
      await payEntireBill(bill.stay.reservationId);
      const res = await getMyLastStayBill();
      setBill(res.data);
      setSuccess('Entire bill paid.');
    } catch (err) {
      setError(err.response?.data || 'Could not pay entire bill');
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-8 py-10">
        <p className="text-on-surface-muted">Loading bill...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="bg-tertiary/8 text-tertiary px-4 py-3 rounded-lg">{error}</div>
      </div>
    );
  }

  if (!bill?.stay) {
    return (
      <div className="max-w-6xl mx-auto px-8 py-10">
        <h1 className="font-serif text-on-surface tracking-tight mb-4">My Bill</h1>
        <p className="text-on-surface-muted">No reservations found yet.</p>
      </div>
    );
  }

  const amountDue = bill.fullyPaid ? 0 : bill.grandTotal;

  return (
    <div className="max-w-6xl mx-auto px-8 py-10">
      <h1 className="font-serif text-on-surface tracking-tight mb-8">My Bill</h1>
      {error && <div className="bg-tertiary/8 text-tertiary px-4 py-3 rounded-lg mb-5">{error}</div>}
      {success && <div className="bg-primary/8 text-primary px-4 py-3 rounded-lg mb-5">{success}</div>}

      <div className="bg-surface-lowest rounded-2xl p-6 shadow-ambient mb-8">
        <h2 className="font-serif text-on-surface text-xl font-medium mb-4">Last Stay</h2>
        <div className="grid gap-2 text-sm text-on-surface">
          <div>Reservation #{bill.stay.reservationId}</div>
          <div>Room {bill.stay.roomNumber}</div>
          <div>{bill.stay.checkInDate} to {bill.stay.checkOutDate}</div>
          <div>Status: {bill.stay.status}</div>
          <div className="font-serif font-semibold mt-2">Room Charge: ${bill.roomCharge.toFixed(2)}</div>
        </div>
      </div>

      <div className="bg-surface-lowest rounded-2xl p-6 shadow-ambient mb-8">
        <h2 className="font-serif text-on-surface text-xl font-medium mb-4">Store Purchases</h2>
        {!bill.storePurchases?.length ? (
          <p className="text-on-surface-muted text-sm">No store purchases for this stay.</p>
        ) : (
          <div className="space-y-5">
            {bill.storePurchases.map((purchase) => (
              <div key={purchase.billId} className="border border-surface-container rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-on-surface">Order #{purchase.orderId}</div>
                  <div className="text-xs uppercase tracking-[0.06rem] text-on-surface-muted">
                    {purchase.paymentMethod === 'CHARGE_ROOM' ? 'Charged to Room' : 'Paid at Checkout'}
                    {purchase.paid ? ' (Paid)' : ' (Pending)'}
                  </div>
                </div>
                {purchase.items.map((item) => (
                  <div key={`${purchase.billId}-${item.productId}`} className="flex justify-between text-sm py-1.5 text-on-surface">
                    <span>{item.name} x{item.quantity}</span>
                    <span>${item.lineTotal.toFixed(2)}</span>
                  </div>
                ))}
                <div className="font-serif font-semibold text-on-surface mt-3 pt-3 border-t border-surface-container">
                  Store Total: ${purchase.totalAmount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-surface-lowest rounded-2xl p-6 shadow-ambient">
        <h2 className="font-serif text-on-surface text-xl font-medium mb-4">Summary</h2>
        <div className="flex justify-between text-on-surface text-sm py-1">
          <span>Room Charge</span>
          <span>${bill.roomCharge.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-on-surface text-sm py-1">
          <span>Store Charges</span>
          <span>${bill.storeChargeTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-on-surface text-sm py-1">
          <span>Total</span>
          <span>${bill.grandTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-serif font-semibold text-on-surface pt-3 mt-3 border-t border-surface-container">
          <span>Amount Due</span>
          <span>${amountDue.toFixed(2)}</span>
        </div>
        <button
          onClick={handlePayEntire}
          className="mt-5 w-full py-3.5 bg-linear-to-br from-primary to-primary-container text-white border-0 rounded-xl text-xs font-semibold uppercase tracking-[0.1rem] cursor-pointer font-sans"
        >
          Pay Entire Bill
        </button>
      </div>
    </div>
  );
}
