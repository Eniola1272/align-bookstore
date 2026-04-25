'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@/hooks/useUser';

interface OrderItem {
  bookId: string;
  title: string;
  author: string;
  coverImage?: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  shippingAddress: {
    fullName: string;
    city: string;
    country: string;
  };
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
  const { status } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/orders')
        .then(r => r.json())
        .then(data => setOrders(Array.isArray(data) ? data : []))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-brand-950 mb-4">Please sign in to view your orders</h2>
          <Link href="/auth/signin" className="px-6 py-3 bg-brand-600 text-white font-medium rounded-pill hover:bg-brand-700 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif text-brand-950 mb-8">My Orders</h1>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-card border border-brand-100 p-6 animate-pulse">
                <div className="h-4 bg-brand-100 rounded w-1/4 mb-4" />
                <div className="h-3 bg-brand-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-card border border-brand-100">
            <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-brand-950 mb-2">No orders yet</h3>
            <p className="text-brand-500 mb-6">When you place orders, they&apos;ll appear here</p>
            <Link href="/shop" className="px-6 py-3 bg-brand-600 text-white font-medium rounded-pill hover:bg-brand-700 transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-card border border-brand-100 p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-brand-950">{order.orderNumber}</h3>
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-pill capitalize ${STATUS_STYLES[order.status] || 'bg-brand-100 text-brand-700'}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-brand-400 mt-1">
                      {new Date(order.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                      {' · '}
                      {order.shippingAddress?.city}, {order.shippingAddress?.country}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-brand-700 text-lg">₦{order.total.toLocaleString()}</p>
                    <p className="text-xs text-brand-400">{order.paymentStatus}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex-shrink-0 flex gap-3 items-center bg-brand-50 rounded-lg p-3 min-w-0 max-w-xs">
                      <div className="relative w-10 h-14 flex-shrink-0 rounded overflow-hidden bg-brand-100">
                        <Image
                          src={item.coverImage || '/book-placeholder.png'}
                          alt={item.title}
                          fill
                          className="object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/book-placeholder.png'; }}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-brand-950 truncate">{item.title}</p>
                        <p className="text-xs text-brand-400">Qty: {item.quantity}</p>
                        <p className="text-xs font-semibold text-brand-600">₦{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
