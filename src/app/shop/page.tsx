import { Suspense } from 'react';
import ShopContent from './ShopContent';

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
