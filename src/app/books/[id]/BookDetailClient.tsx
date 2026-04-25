'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import BookCard from '@/components/BookCard';
import { toast } from 'sonner';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  isbn?: string | null;
  genre: string;
  subGenre?: string | null;
  publisher?: string | null;
  publishedYear?: number | null;
  pages?: number | null;
  language: string;
  condition: string;
  coverImage: string;
  stock: number;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  bestseller?: boolean;
  tags?: string[];
}

const CONDITION_LABELS: Record<string, { label: string; color: string }> = {
  new: { label: 'New', color: 'bg-green-100 text-green-700' },
  'like-new': { label: 'Like New', color: 'bg-emerald-100 text-emerald-700' },
  good: { label: 'Good', color: 'bg-blue-100 text-blue-700' },
  fair: { label: 'Fair', color: 'bg-amber-100 text-amber-700' },
};

export default function BookDetailClient({
  book,
  relatedBooks,
}: {
  book: Book;
  relatedBooks: Book[];
}) {
  const { addItem, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const discount = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  const conditionInfo = CONDITION_LABELS[book.condition] || { label: book.condition, color: 'bg-brand-100 text-brand-700' };

  function handleAddToCart() {
    for (let i = 0; i < quantity; i++) {
      addItem({
        bookId: book.id,
        title: book.title,
        author: book.author,
        coverImage: book.coverImage,
        price: book.price,
        stock: book.stock,
      });
    }
    setAdded(true);
    openCart();
    toast.success(`${quantity > 1 ? `${quantity}× ` : ''}"${book.title}" added to cart.`);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-brand-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-brand-400">
            <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-brand-600 transition-colors">Shop</Link>
            <span>/</span>
            <Link href={`/shop?genre=${encodeURIComponent(book.genre)}`} className="hover:text-brand-600 transition-colors">{book.genre}</Link>
            <span>/</span>
            <span className="text-brand-600 truncate max-w-[200px]">{book.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Book Cover */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-72 max-w-full aspect-[2/3] rounded-card-lg overflow-hidden shadow-2xl">
              <Image
                src={book.coverImage || '/book-placeholder.png'}
                alt={book.title}
                fill
                className="object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = '/book-placeholder.png'; }}
                priority
              />
              {discount > 0 && (
                <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-pill">
                  -{discount}%
                </div>
              )}
              {book.bestseller && (
                <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-pill">
                  Bestseller
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link
                href={`/shop?genre=${encodeURIComponent(book.genre)}`}
                className="text-xs font-semibold text-brand-500 uppercase tracking-wider hover:text-brand-700 transition-colors"
              >
                {book.genre}
              </Link>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-pill ${conditionInfo.color}`}>
                {conditionInfo.label}
              </span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-serif text-brand-950 leading-tight">{book.title}</h1>
            <p className="text-lg text-brand-500 mt-2">by <span className="font-medium text-brand-700">{book.author}</span></p>

            {/* Rating */}
            {book.reviewCount > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <div className="flex">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className={`w-4 h-4 ${s <= Math.round(book.rating) ? 'text-amber-400' : 'text-brand-200'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-brand-500">{book.rating.toFixed(1)} ({book.reviewCount} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-5">
              <span className="text-4xl font-bold text-brand-700">₦{book.price.toLocaleString()}</span>
              {book.originalPrice && (
                <span className="text-xl text-brand-300 line-through">₦{book.originalPrice.toLocaleString()}</span>
              )}
              {discount > 0 && (
                <span className="text-sm font-semibold text-red-500">Save {discount}%</span>
              )}
            </div>

            {/* Stock */}
            <div className="mt-3">
              {book.stock > 10 ? (
                <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full" /> In Stock
                </span>
              ) : book.stock > 0 ? (
                <span className="text-sm text-amber-600 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 bg-amber-500 rounded-full" /> Only {book.stock} left
                </span>
              ) : (
                <span className="text-sm text-red-600 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full" /> Out of Stock
                </span>
              )}
            </div>

            {/* Description */}
            {book.description && (
              <p className="text-brand-600 mt-5 leading-relaxed text-sm">{book.description}</p>
            )}

            {/* Add to Cart */}
            {book.stock > 0 && (
              <div className="flex items-center gap-3 mt-7">
                <div className="flex items-center border border-brand-200 rounded-pill overflow-hidden">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-3 py-2.5 text-brand-500 hover:bg-brand-50 transition-colors"
                  >
                    −
                  </button>
                  <span className="px-4 py-2.5 text-sm font-semibold text-brand-950 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => Math.min(book.stock, q + 1))}
                    className="px-3 py-2.5 text-brand-500 hover:bg-brand-50 transition-colors"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 rounded-pill font-semibold text-sm transition-all shadow-glow ${
                    added
                      ? 'bg-green-500 text-white'
                      : 'bg-brand-600 text-white hover:bg-brand-700'
                  }`}
                >
                  {added ? '✓ Added to Cart' : 'Add to Cart'}
                </button>
              </div>
            )}

            {book.stock > 0 && (
              <Link
                href="/cart"
                className="block w-full mt-3 py-3 rounded-pill font-semibold text-sm text-brand-700 border-2 border-brand-200 hover:border-brand-400 text-center transition-colors"
              >
                View Cart & Checkout
              </Link>
            )}

            {/* Shipping Info */}
            <div className="mt-6 p-4 bg-brand-50 rounded-card space-y-2 text-sm text-brand-600">
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                Free shipping on orders over $50
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Delivery in 3-5 business days
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                30-day hassle-free returns
              </p>
            </div>

            {/* Book Details */}
            <div className="mt-6 border-t border-brand-100 pt-5">
              <h3 className="text-sm font-semibold text-brand-950 mb-3">Book Details</h3>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {book.isbn && (
                  <>
                    <dt className="text-brand-400">ISBN</dt>
                    <dd className="text-brand-700">{book.isbn}</dd>
                  </>
                )}
                {book.publisher && (
                  <>
                    <dt className="text-brand-400">Publisher</dt>
                    <dd className="text-brand-700">{book.publisher}</dd>
                  </>
                )}
                {book.publishedYear && (
                  <>
                    <dt className="text-brand-400">Year</dt>
                    <dd className="text-brand-700">{book.publishedYear}</dd>
                  </>
                )}
                {book.pages && (
                  <>
                    <dt className="text-brand-400">Pages</dt>
                    <dd className="text-brand-700">{book.pages}</dd>
                  </>
                )}
                <dt className="text-brand-400">Language</dt>
                <dd className="text-brand-700">{book.language}</dd>
                <dt className="text-brand-400">Condition</dt>
                <dd className="text-brand-700">{conditionInfo.label}</dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-serif text-brand-950 mb-6">More in {book.genre}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedBooks.map(rb => (
                <BookCard key={rb.id} book={rb} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
