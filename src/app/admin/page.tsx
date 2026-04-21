'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Stats {
  totalBooks: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  pendingOrders: number;
  ordersByStatus: Record<string, number>;
  lowStock: Array<{ _id: string; title: string; author: string; stock: number; coverImage?: string }>;
  recentOrders: Array<{
    _id: string;
    orderNumber: string;
    createdAt: string;
    total: number;
    status: string;
    paymentStatus: string;
    shippingAddress: { fullName: string };
  }>;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your store</p>
      </div>

      {/* Stat Cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard label="Total Books" value={stats.totalBooks.toLocaleString()} icon="📚" color="bg-blue-50 text-blue-600" />
        <StatCard label="Total Orders" value={stats.totalOrders.toLocaleString()} icon="📦" color="bg-purple-50 text-purple-600" />
        <StatCard label="Revenue (paid)" value={`₦${stats.totalRevenue.toLocaleString()}`} icon="💰" color="bg-green-50 text-green-600" />
        <StatCard label="Pending Orders" value={stats.pendingOrders.toLocaleString()} icon="⏳" color="bg-yellow-50 text-yellow-600" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-brand-600 hover:text-brand-800 font-medium">View all →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {stats.recentOrders.length === 0 && (
              <p className="px-5 py-8 text-sm text-gray-400 text-center">No orders yet</p>
            )}
            {stats.recentOrders.map(order => (
              <Link
                key={order._id}
                href={`/admin/orders/${order._id}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                  <p className="text-xs text-gray-400">{order.shippingAddress?.fullName} · {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-700">₦{order.total.toLocaleString()}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {order.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Low Stock</h2>
            <Link href="/admin/books" className="text-xs text-brand-600 hover:text-brand-800 font-medium">Manage books →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {stats.lowStock.length === 0 && (
              <p className="px-5 py-8 text-sm text-gray-400 text-center">All books are well stocked</p>
            )}
            {stats.lowStock.map(book => (
              <Link
                key={book._id}
                href={`/admin/books/${book._id}/edit`}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors"
              >
                <div className="relative w-8 h-11 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                  <Image
                    src={book.coverImage || '/book-placeholder.png'}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{book.title}</p>
                  <p className="text-xs text-gray-400 truncate">{book.author}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${book.stock === 0 ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'}`}>
                  {book.stock === 0 ? 'Out of stock' : `${book.stock} left`}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xl w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>{icon}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}
