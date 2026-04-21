import { Suspense } from 'react';
import OrderSuccessContent from './OrderSuccessContent';

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
