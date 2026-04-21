import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { Order } from '@/lib/db/models/Order';
import Link from 'next/link';
import Image from 'next/image';

async function getProfileData(userId: string) {
  await connectDB();

  const [user, orders] = await Promise.all([
    User.findById(userId).select('-password').lean(),
    Order.find({ userId }).sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  if (!user) throw new Error('User not found');

  const totalSpend = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.total, 0);

  return {
    user: JSON.parse(JSON.stringify(user)),
    recentOrders: JSON.parse(JSON.stringify(orders)),
    stats: {
      totalOrders: orders.length,
      totalSpend,
    },
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

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) redirect('/auth/signin');

  let data;
  try {
    data = await getProfileData(session.user.id);
  } catch {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="text-brand-500">Failed to load profile.</p>
      </div>
    );
  }

  const { user, recentOrders, stats } = data;

  return (
    <div className="min-h-screen bg-surface py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Profile Header */}
        <div className="bg-white rounded-card border border-brand-100 p-8">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full ring-4 ring-brand-100"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center ring-4 ring-brand-100">
                  <span className="text-white text-2xl font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-serif text-brand-950">{user.name}</h1>
                  {user.username && (
                    <p className="text-sm text-brand-400 mt-0.5">@{user.username}</p>
                  )}
                  <p className="text-sm text-brand-400">{user.email}</p>
                </div>
                <Link
                  href="/profile/edit"
                  className="flex-shrink-0 px-4 py-2 bg-brand-100 text-brand-700 rounded-pill hover:bg-brand-200 text-sm font-medium transition-colors"
                >
                  Edit Profile
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="p-4 bg-brand-50 rounded-card border border-brand-100 text-center">
                  <p className="text-2xl font-bold text-brand-700">{stats.totalOrders}</p>
                  <p className="text-xs text-brand-500 mt-1">Total Orders</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-card border border-amber-100 text-center">
                  <p className="text-2xl font-bold text-amber-700">₦{stats.totalSpend.toLocaleString()}</p>
                  <p className="text-xs text-brand-500 mt-1">Total Spent</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-card border border-brand-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-brand-950">Recent Orders</h2>
            <Link href="/orders" className="text-sm text-brand-600 hover:text-brand-800 font-medium transition-colors">
              View all →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-brand-500 text-sm mb-4">You haven&apos;t placed any orders yet</p>
              <Link
                href="/shop"
                className="px-5 py-2 bg-brand-600 text-white text-sm font-medium rounded-pill hover:bg-brand-700 transition-colors"
              >
                Browse Books
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order: {
                _id: string;
                orderNumber: string;
                total: number;
                status: string;
                createdAt: string;
                items: Array<{ title: string; quantity: number }>;
              }) => (
                <div key={order._id} className="flex items-center justify-between p-4 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-brand-950">{order.orderNumber}</p>
                    <p className="text-xs text-brand-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                      {' · '}
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-pill capitalize ${STATUS_STYLES[order.status] || 'bg-brand-100 text-brand-700'}`}>
                      {order.status}
                    </span>
                    <span className="text-sm font-bold text-brand-700">₦{order.total.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { href: '/shop', label: 'Browse Shop', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },
            { href: '/orders', label: 'My Orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { href: '/profile/edit', label: 'Edit Profile', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
          ].map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 p-4 bg-white rounded-card border border-brand-100 hover:border-brand-300 hover:shadow-soft transition-all"
            >
              <div className="w-9 h-9 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                </svg>
              </div>
              <span className="text-sm font-medium text-brand-700">{label}</span>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
