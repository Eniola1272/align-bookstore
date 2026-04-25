import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { getProfileById, getOrdersByUser } from '@/lib/supabase/queries';
import Link from 'next/link';
import Image from 'next/image';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default async function ProfilePage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/signin');

  const [profile, recentOrders] = await Promise.all([
    getProfileById(user.id),
    getOrdersByUser(user.id).then(orders => orders.slice(0, 5)),
  ]);

  if (!profile) redirect('/auth/signin');

  const totalSpend = recentOrders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((s: number, o) => s + o.total, 0);

  return (
    <div className="min-h-screen bg-surface py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-white rounded-card border border-brand-100 p-8">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              {profile.avatar ? (
                <Image src={profile.avatar} alt={profile.name} width={80} height={80} className="w-20 h-20 rounded-full ring-4 ring-brand-100" />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center ring-4 ring-brand-100">
                  <span className="text-white text-2xl font-bold">{profile.name?.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-serif text-brand-950">{profile.name}</h1>
                  {profile.username && <p className="text-sm text-brand-400 mt-0.5">@{profile.username}</p>}
                  <p className="text-sm text-brand-400">{user.email}</p>
                </div>
                <Link href="/profile/edit" className="flex-shrink-0 px-4 py-2 bg-brand-100 text-brand-700 rounded-pill hover:bg-brand-200 text-sm font-medium transition-colors">
                  Edit Profile
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="p-4 bg-brand-50 rounded-card border border-brand-100 text-center">
                  <p className="text-2xl font-bold text-brand-700">{recentOrders.length}</p>
                  <p className="text-xs text-brand-500 mt-1">Total Orders</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-card border border-amber-100 text-center">
                  <p className="text-2xl font-bold text-amber-700">₦{totalSpend.toLocaleString()}</p>
                  <p className="text-xs text-brand-500 mt-1">Total Spent</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-card border border-brand-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-brand-950">Recent Orders</h2>
            <Link href="/orders" className="text-sm text-brand-600 hover:text-brand-800 font-medium transition-colors">View all →</Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-brand-500 text-sm mb-4">You haven&apos;t placed any orders yet</p>
              <Link href="/shop" className="px-5 py-2 bg-brand-600 text-white text-sm font-medium rounded-pill hover:bg-brand-700 transition-colors">Browse Books</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => {
                const items = order.items as Array<{ title: string }>;
                return (
                <div key={order.id} className="flex items-center justify-between p-4 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-brand-950">{order.orderNumber}</p>
                    <p className="text-xs text-brand-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {' · '}
                      {items.length} {items.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-pill capitalize ${STATUS_STYLES[order.status] || 'bg-brand-100 text-brand-700'}`}>{order.status}</span>
                    <span className="text-sm font-bold text-brand-700">₦{order.total.toLocaleString()}</span>
                  </div>
                </div>
              ); })}
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { href: '/shop', label: 'Browse Shop', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },
            { href: '/orders', label: 'My Orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { href: '/profile/edit', label: 'Edit Profile', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
          ].map(({ href, label, icon }) => (
            <Link key={href} href={href} className="flex items-center gap-3 p-4 bg-white rounded-card border border-brand-100 hover:border-brand-300 hover:shadow-soft transition-all">
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
