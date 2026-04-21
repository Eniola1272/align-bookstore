'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, itemCount, subtotal } = useCart();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-brand-100">
          <div>
            <h2 className="text-lg font-semibold text-brand-950">Your Cart</h2>
            <p className="text-sm text-brand-400">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-brand-100 text-brand-400 hover:text-brand-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="font-medium text-brand-700">Your cart is empty</p>
              <p className="text-sm text-brand-400 mt-1">Browse our collection and add some books</p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="mt-4 px-5 py-2 bg-brand-600 text-white text-sm font-medium rounded-pill hover:bg-brand-700 transition-colors"
              >
                Browse Shop
              </Link>
            </div>
          ) : (
            items.map(item => (
              <div key={item.bookId} className="flex gap-4 py-4 border-b border-brand-50 last:border-0">
                <div className="relative w-14 h-20 flex-shrink-0 rounded-md overflow-hidden bg-brand-50">
                  <Image
                    src={item.coverImage || '/book-placeholder.png'}
                    alt={item.title}
                    fill
                    className="object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/book-placeholder.png'; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-brand-950 truncate">{item.title}</p>
                  <p className="text-xs text-brand-400 truncate">{item.author}</p>
                  <p className="text-sm font-semibold text-brand-600 mt-1">₦{item.price.toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.bookId, item.quantity - 1)}
                      className="w-6 h-6 rounded-full border border-brand-200 flex items-center justify-center hover:border-brand-400 text-brand-500 text-xs transition-colors"
                    >
                      −
                    </button>
                    <span className="text-sm font-medium text-brand-950 w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="w-6 h-6 rounded-full border border-brand-200 flex items-center justify-center hover:border-brand-400 text-brand-500 text-xs transition-colors disabled:opacity-40"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.bookId)}
                      className="ml-auto text-brand-300 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-brand-100 px-6 py-5 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-brand-500">Subtotal</span>
              <span className="font-semibold text-brand-950">₦{subtotal.toLocaleString()}</span>
            </div>
            <p className="text-xs text-brand-400">
              {subtotal >= 50000
                ? '🎉 Free delivery on Ibadan orders!'
                : `Free Ibadan delivery on orders over ₦50,000`}
            </p>
            <Link
              href="/cart"
              onClick={closeCart}
              className="block w-full py-3 bg-brand-600 text-white text-sm font-semibold text-center rounded-pill hover:bg-brand-700 transition-colors shadow-glow"
            >
              View Cart & Checkout
            </Link>
            <button
              onClick={closeCart}
              className="block w-full py-2 text-sm text-brand-500 hover:text-brand-700 text-center transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
