'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
  stripePaymentIntentId?: string;
  notes?: string;
  shippingAddress: {
    fullName: string;
    email: string;
    phone?: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    bookId: string;
    title: string;
    author: string;
    coverImage?: string;
    price: number;
    quantity: number;
  }>;
}

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUSES = ['unpaid', 'paid', 'refunded'];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then(r => r.json())
      .then((data: Order) => {
        setOrder(data);
        setStatus(data.status);
        setPaymentStatus(data.paymentStatus);
        setNotes(data.notes || '');
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave() {
    setSaving(true);
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, paymentStatus, notes }),
    });
    if (res.ok) {
      const updated: Order = await res.json();
      setOrder(updated);
      toast.success('Order updated successfully.');
    } else {
      toast.error('Failed to update order.');
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 text-center text-gray-400">
        Order not found. <Link href="/admin/orders" className="text-brand-600">Back to orders</Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-3">
          <Link href="/admin/orders" className="hover:text-gray-600">Orders</Link>
          <span>/</span>
          <span className="text-gray-700">{order.orderNumber}</span>
        </nav>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{order.orderNumber}</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Placed {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <span className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
            {order.status}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Items + Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Order Items ({order.items.length})</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  <div className="relative w-10 h-14 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                    <Image
                      src={item.coverImage || '/book-placeholder.png'}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.title}</p>
                    <p className="text-xs text-gray-400">{item.author}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</p>
                    <p className="text-xs text-gray-400">₦{item.price.toLocaleString()} × {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₦{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span>{order.shippingCost === 0 ? <span className="text-green-600">Free</span> : `₦${order.shippingCost.toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-gray-200 text-base">
                <span>Total</span>
                <span>₦{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Payment</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span className="capitalize font-medium">{order.paymentStatus}</span>
              </div>
              {order.stripePaymentIntentId && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Reference</span>
                  <span className="font-mono text-xs">{order.stripePaymentIntentId}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Customer + Update */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Customer</h2>
            <div className="space-y-1 text-sm">
              <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
              <p className="text-gray-500">{order.shippingAddress.email}</p>
              {order.shippingAddress.phone && <p className="text-gray-500">{order.shippingAddress.phone}</p>}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Shipping Address</h2>
            <address className="text-sm text-gray-600 not-italic space-y-0.5">
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p>{order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
            </address>
          </div>

          {/* Update Status */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Update Order</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Order Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-400"
                >
                  {ORDER_STATUSES.map(s => (
                    <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={e => setPaymentStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-400"
                >
                  {PAYMENT_STATUSES.map(s => (
                    <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Internal Notes</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Add notes about this order…"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-400 resize-none"
                />
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
