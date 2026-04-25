'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/hooks/useUser';
import { calculateShipping, isIbadan, FREE_SHIPPING_THRESHOLD } from '@/lib/shipping';

interface ShippingForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export default function CheckoutPage() {
  const { profile, status } = useUser();
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState<ShippingForm>({
    fullName: profile?.name || '',
    email: profile?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Nigeria',
  });
  const [loading, setLoading] = useState(false);

  const shipping = calculateShipping(subtotal, form.city);
  const total = subtotal + shipping;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!profile) {
      window.location.href = '/auth/signin';
      return;
    }

    if (items.length === 0) {
      router.push('/cart');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, shippingAddress: form }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Checkout failed. Please try again.');
        return;
      }

      if (data.url) {
        clearCart();
        window.location.href = data.url;
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-brand-950 mb-4">Your cart is empty</h2>
          <Link href="/shop" className="text-brand-600 hover:text-brand-800 font-medium">Browse Books →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm text-brand-400 mb-4">
            <Link href="/cart" className="hover:text-brand-600">Cart</Link>
            <span>/</span>
            <span className="text-brand-600 font-medium">Checkout</span>
          </nav>
          <h1 className="text-3xl font-serif text-brand-950">Checkout</h1>
        </div>

        {!profile && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-card flex items-center justify-between gap-4">
            <p className="text-sm text-amber-800">
              Sign in to complete your purchase and track your order
            </p>
            <button
              onClick={() => window.location.href = '/auth/signin'}
              className="px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-pill hover:bg-amber-600 transition-colors flex-shrink-0"
            >
              Sign In
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Shipping Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-card border border-brand-100 p-6">
                <h2 className="text-lg font-semibold text-brand-950 mb-5">Shipping Information</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-brand-700 mb-1">Full Name *</label>
                    <input
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-brand-200 rounded-lg text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-700 mb-1">Email *</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-brand-200 rounded-lg text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-700 mb-1">Phone</label>
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-brand-200 rounded-lg text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                      placeholder="+234 800 000 0000"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-brand-700 mb-1">Street Address *</label>
                    <input
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-brand-200 rounded-lg text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                      placeholder="123 Main Street, Apt 4B"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-700 mb-1">City *</label>
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-brand-200 rounded-lg text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                      placeholder="Lagos"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-700 mb-1">State *</label>
                    <input
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-brand-200 rounded-lg text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                      placeholder="Lagos State"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-700 mb-1">Postal Code *</label>
                    <input
                      name="postalCode"
                      value={form.postalCode}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-brand-200 rounded-lg text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                      placeholder="100001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-700 mb-1">Country</label>
                    <select
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-brand-200 rounded-lg text-sm focus:outline-none focus:border-brand-400 text-brand-700"
                    >
                      <option>Nigeria</option>
                      <option>Ghana</option>
                      <option>Kenya</option>
                      <option>South Africa</option>
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Canada</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Note */}
              <div className="bg-white rounded-card border border-brand-100 p-6">
                <h2 className="text-lg font-semibold text-brand-950 mb-3">Payment</h2>
                <div className="flex items-center gap-3 p-4 bg-brand-50 rounded-lg">
                  <svg className="w-8 h-8 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-brand-950">Secure Payment via Paystack</p>
                    <p className="text-xs text-brand-500 mt-0.5">You&apos;ll be redirected to Paystack&apos;s secure payment page</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-card border border-brand-100 p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-brand-950 mb-4">Your Order</h2>
                <div className="space-y-3 mb-5">
                  {items.map(item => (
                    <div key={item.bookId} className="flex gap-3">
                      <div className="relative w-10 h-14 flex-shrink-0 rounded overflow-hidden bg-brand-50">
                        <Image
                          src={item.coverImage || '/book-placeholder.png'}
                          alt={item.title}
                          fill
                          className="object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/book-placeholder.png'; }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-brand-950 line-clamp-2 leading-tight">{item.title}</p>
                        <p className="text-xs text-brand-400 mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-xs font-semibold text-brand-700 flex-shrink-0">₦{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-brand-100 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-brand-500">Subtotal</span>
                    <span>₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-500">Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                      {!form.city ? '—' : shipping === 0 ? 'Free' : `₦${shipping.toLocaleString()}`}
                    </span>
                  </div>
                  {form.city && isIbadan(form.city) && subtotal < FREE_SHIPPING_THRESHOLD && (
                    <p className="text-xs text-brand-400">
                      Add ₦{(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString()} more for free Ibadan delivery
                    </p>
                  )}
                  {form.city && !isIbadan(form.city) && (
                    <p className="text-xs text-brand-400">
                      Free delivery available for Ibadan orders over ₦{FREE_SHIPPING_THRESHOLD.toLocaleString()}
                    </p>
                  )}
                  <div className="flex justify-between font-bold text-base border-t border-brand-100 pt-2 mt-2">
                    <span>Total</span>
                    <span className="text-brand-700">₦{total.toLocaleString()}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading || !profile}
                  className="w-full mt-5 py-3.5 bg-brand-600 text-white font-semibold rounded-pill hover:bg-brand-700 transition-colors shadow-glow disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Redirecting...
                    </>
                  ) : (
                    `Pay ₦${total.toLocaleString()}`
                  )}
                </button>
                {!profile && (
                  <p className="text-xs text-brand-400 text-center mt-2">Sign in required to checkout</p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
