'use client';

import { SessionProvider } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import { CartProvider } from '@/context/CartContext';
import CartDrawer from '@/components/CartDrawer';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        <Navbar />
        <CartDrawer />
        {children}
      </CartProvider>
    </SessionProvider>
  );
}
