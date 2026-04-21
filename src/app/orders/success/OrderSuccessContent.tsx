'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';

type VerifyState = 'loading' | 'success' | 'failed' | 'no-ref';

export default function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [state, setState] = useState<VerifyState>('loading');
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    const reference = searchParams.get('reference') || searchParams.get('trxref');

    if (!reference) {
      setState('no-ref');
      clearCart();
      return;
    }

    fetch(`/api/verify-payment?reference=${encodeURIComponent(reference)}`)
      .then(r => r.json())
      .then(data => {
        if (data.order) {
          setOrderNumber(data.order.orderNumber);
          clearCart();
          setState('success');
        } else {
          setState('failed');
        }
      })
      .catch(() => setState('failed'));
  }, [searchParams, clearCart]);

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-brand-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-brand-500 text-sm">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (state === 'failed') {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-serif text-brand-950 mb-3">Payment Verification Failed</h1>
          <p className="text-brand-500 mb-8">
            We couldn&apos;t verify your payment. If money was deducted, please contact support with your payment reference.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/cart" className="px-6 py-3 bg-brand-600 text-white font-semibold rounded-pill hover:bg-brand-700 transition-colors">
              Return to Cart
            </Link>
            <Link href="/shop" className="px-6 py-3 border border-brand-200 text-brand-700 font-semibold rounded-pill hover:border-brand-400 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // success or no-ref (treat as success — payment happened but ref not in URL)
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-serif text-brand-950 mb-3">Order Confirmed!</h1>
        {orderNumber && (
          <p className="text-sm font-mono bg-brand-50 text-brand-700 px-4 py-2 rounded-lg inline-block mb-4">
            {orderNumber}
          </p>
        )}
        <p className="text-brand-500 leading-relaxed mb-2">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        <p className="text-sm text-brand-400 mb-8">
          You&apos;ll receive a confirmation email shortly.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/orders" className="px-6 py-3 bg-brand-600 text-white font-semibold rounded-pill hover:bg-brand-700 transition-colors">
            View My Orders
          </Link>
          <Link href="/shop" className="px-6 py-3 border border-brand-200 text-brand-700 font-semibold rounded-pill hover:border-brand-400 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
