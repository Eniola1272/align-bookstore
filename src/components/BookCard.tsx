'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface BookCardProps {
  book: {
    _id: string;
    title: string;
    author: string;
    price: number;
    originalPrice?: number;
    coverImage: string;
    genre: string;
    condition: string;
    rating: number;
    reviewCount: number;
    stock: number;
    bestseller?: boolean;
    featured?: boolean;
  };
}

export default function BookCard({ book }: BookCardProps) {
  const { addItem } = useCart();

  const discount = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addItem({
      bookId: book._id,
      title: book.title,
      author: book.author,
      coverImage: book.coverImage,
      price: book.price,
      stock: book.stock,
    });
  }

  return (
    <Link href={`/books/${book._id}`} className="group block">
      <div className="bg-white rounded-card border border-brand-100 overflow-hidden hover:border-brand-300 hover:shadow-soft transition-all duration-200">
        {/* Cover */}
        <div className="relative aspect-[2/3] overflow-hidden bg-brand-50">
          <Image
            src={book.coverImage || '/book-placeholder.png'}
            alt={book.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { (e.target as HTMLImageElement).src = '/book-placeholder.png'; }}
          />
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {book.bestseller && (
              <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-pill uppercase tracking-wide">
                Bestseller
              </span>
            )}
            {discount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-pill">
                -{discount}%
              </span>
            )}
          </div>
          {book.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-brand-700 text-xs font-semibold px-3 py-1 rounded-pill">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="text-[11px] text-brand-400 uppercase tracking-wide font-medium">{book.genre}</p>
          <h3 className="text-sm font-semibold text-brand-950 mt-0.5 leading-tight line-clamp-2 group-hover:text-brand-600 transition-colors">
            {book.title}
          </h3>
          <p className="text-xs text-brand-500 mt-0.5 truncate">{book.author}</p>

          {/* Rating */}
          {book.reviewCount > 0 && (
            <div className="flex items-center gap-1 mt-1.5">
              <div className="flex">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} className={`w-3 h-3 ₦{s <= Math.round(book.rating) ? 'text-amber-400' : 'text-brand-200'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-[10px] text-brand-400">({book.reviewCount})</span>
            </div>
          )}

          {/* Price + Add to Cart */}
          <div className="flex items-center justify-between mt-2">
            <div>
              <span className="text-sm font-bold text-brand-700">₦{book.price.toLocaleString()}</span>
              {book.originalPrice && (
                <span className="text-xs text-brand-300 line-through ml-1">₦{book.originalPrice.toLocaleString()}</span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={book.stock === 0}
              className="w-7 h-7 bg-brand-600 text-white rounded-full flex items-center justify-center hover:bg-brand-700 transition-colors shadow-glow disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              title="Add to cart"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
