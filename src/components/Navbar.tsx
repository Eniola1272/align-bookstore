'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const { itemCount, toggleCart } = useCart();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <nav className="bg-white/90 backdrop-blur-xl border-b border-brand-200/70 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Desktop Nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-gradient-to-br from-brand-600 to-brand-400 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shadow-glow">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              </div>
              <span className="text-xl font-serif font-normal text-brand-950 hidden sm:block tracking-tight">
                PageTurn
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/shop"
                className={`text-sm font-medium transition-colors ${
                  isActive('/shop') ? 'text-brand-600' : 'text-brand-500 hover:text-brand-950'
                }`}
              >
                Shop
              </Link>
              <Link
                href="/shop?genre=Fiction"
                className="text-sm font-medium text-brand-500 hover:text-brand-950 transition-colors"
              >
                Fiction
              </Link>
              <Link
                href="/shop?genre=Non-Fiction"
                className="text-sm font-medium text-brand-500 hover:text-brand-950 transition-colors"
              >
                Non-Fiction
              </Link>
              <Link
                href="/shop?bestseller=true"
                className="text-sm font-medium text-brand-500 hover:text-brand-950 transition-colors"
              >
                Bestsellers
              </Link>
              {session && (
                <Link
                  href="/orders"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/orders') ? 'text-brand-600' : 'text-brand-500 hover:text-brand-950'
                  }`}
                >
                  My Orders
                </Link>
              )}
            </div>
          </div>

          {/* Right Section: Cart + Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative p-2 rounded-lg hover:bg-brand-50 text-brand-500 hover:text-brand-700 transition-colors"
              aria-label="Open cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            {status === 'loading' ? (
              <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-brand-50 transition-colors"
                >
                  {session.user?.image ? (
                    <Image
                      width={32}
                      height={32}
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-8 h-8 rounded-full ring-2 ring-brand-200"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-brand-600 to-brand-400 rounded-full flex items-center justify-center ring-2 ring-brand-200">
                      <span className="text-white text-sm font-semibold">
                        {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <svg
                    className={`w-4 h-4 text-brand-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-card shadow-soft border border-brand-200 py-2 z-20">
                      <div className="px-4 py-2 border-b border-brand-100">
                        <p className="text-sm font-medium text-brand-950">{session.user?.name}</p>
                        <p className="text-xs text-brand-400 truncate">{session.user?.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-brand-500 hover:bg-brand-50 hover:text-brand-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                      </Link>
                      <Link
                        href="/orders"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-brand-500 hover:bg-brand-50 hover:text-brand-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        My Orders
                      </Link>
                      <div className="border-t border-brand-100 my-2" />
                      <button
                        onClick={() => { setIsProfileOpen(false); signOut({ callbackUrl: '/' }); }}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 w-full"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="px-5 py-2 bg-brand-600 text-white text-sm font-medium rounded-pill hover:bg-brand-700 transition-colors shadow-glow"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile: Cart + Menu */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleCart}
              className="relative p-2 rounded-lg hover:bg-brand-50 text-brand-500"
              aria-label="Open cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-brand-50"
            >
              <svg className="w-6 h-6 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-brand-200 py-4 space-y-1">
            {[
              { href: '/shop', label: 'Shop' },
              { href: '/shop?genre=Fiction', label: 'Fiction' },
              { href: '/shop?genre=Non-Fiction', label: 'Non-Fiction' },
              { href: '/shop?bestseller=true', label: 'Bestsellers' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 rounded-lg text-sm font-medium text-brand-500 hover:bg-brand-50 hover:text-brand-700"
              >
                {label}
              </Link>
            ))}
            {session ? (
              <>
                <Link href="/orders" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm font-medium text-brand-500 hover:bg-brand-50 hover:text-brand-700">My Orders</Link>
                <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm font-medium text-brand-500 hover:bg-brand-50 hover:text-brand-700">My Profile</Link>
                <div className="border-t border-brand-100 my-2" />
                <button
                  onClick={() => { setIsMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => { setIsMenuOpen(false); signIn(); }}
                className="block w-full text-left px-4 py-2 bg-brand-600 text-white rounded-pill hover:bg-brand-700 text-sm font-medium"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
