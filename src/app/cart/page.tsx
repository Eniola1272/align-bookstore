'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();
  const router = useRouter();

  const shipping = subtotal >= 50000 ? 0 : 1500;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center py-24 px-4">
          <div className="w-24 h-24 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-serif text-brand-950 mb-3">Your cart is empty</h2>
          <p className="text-brand-500 mb-8">Add some books and they&apos;ll appear here</p>
          <Link
            href="/shop"
            className="px-8 py-3 bg-brand-600 text-white font-semibold rounded-pill hover:bg-brand-700 transition-colors"
          >
            Browse Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif text-brand-950">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-sm text-brand-400 hover:text-red-500 transition-colors"
          >
            Clear cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.bookId} className="bg-white rounded-card border border-brand-100 p-4 flex gap-4">
                <div className="relative w-16 h-24 flex-shrink-0 rounded-md overflow-hidden bg-brand-50">
                  <Image
                    src={item.coverImage || '/book-placeholder.png'}
                    alt={item.title}
                    fill
                    className="object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/book-placeholder.png'; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/books/${item.bookId}`} className="font-semibold text-brand-950 hover:text-brand-600 transition-colors line-clamp-2">
                    {item.title}
                  </Link>
                  <p className="text-sm text-brand-400 mt-0.5">{item.author}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-brand-200 rounded-pill overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.bookId, item.quantity - 1)}
                        className="px-3 py-1.5 text-brand-500 hover:bg-brand-50 transition-colors text-sm"
                      >
                        −
                      </button>
                      <span className="px-3 py-1.5 text-sm font-semibold text-brand-950 min-w-[2.5rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="px-3 py-1.5 text-brand-500 hover:bg-brand-50 transition-colors text-sm disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-brand-700">₦{(item.price * item.quantity).toLocaleString()}</span>
                      <button
                        onClick={() => removeItem(item.bookId)}
                        className="text-brand-300 hover:text-red-500 transition-colors"
                        title="Remove"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Link
              href="/shop"
              className="flex items-center gap-2 text-sm text-brand-500 hover:text-brand-700 transition-colors mt-4"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-card border border-brand-100 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-brand-950 mb-5">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-brand-500">Subtotal ({items.reduce((s,i) => s + i.quantity, 0)} items)</span>
                  <span className="font-medium text-brand-950">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-500">Shipping</span>
                  {shipping === 0 ? (
                    <span className="font-medium text-green-600">Free</span>
                  ) : (
                    <span className="font-medium text-brand-950">₦{shipping.toLocaleString()}</span>
                  )}
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-brand-400">
                    Add ₦{(50000 - subtotal).toLocaleString()} more for free shipping
                  </p>
                )}
                <div className="border-t border-brand-100 pt-3 flex justify-between text-base">
                  <span className="font-semibold text-brand-950">Total</span>
                  <span className="font-bold text-brand-700 text-xl">₦{total.toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={() => router.push('/checkout')}
                className="w-full mt-6 py-3.5 bg-brand-600 text-white font-semibold rounded-pill hover:bg-brand-700 transition-colors shadow-glow"
              >
                Proceed to Checkout
              </button>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-brand-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure checkout powered by Stripe
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
