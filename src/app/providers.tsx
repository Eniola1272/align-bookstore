'use client';

import { SessionProvider } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Toaster } from 'sonner';
import Navbar from '@/components/Navbar';
import { CartProvider } from '@/context/CartContext';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <SessionProvider>
      <CartProvider>
        {!isAdmin && <Navbar />}
        {!isAdmin && <CartDrawer />}
        {children}
        {!isAdmin && <Footer />}
        <Toaster position="top-right" richColors closeButton />
      </CartProvider>
    </SessionProvider>
  );
}
