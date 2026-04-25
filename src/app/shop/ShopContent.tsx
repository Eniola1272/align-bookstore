'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import BookCard from '@/components/BookCard';

const GENRES = [
  'All', 'Fiction', 'Non-Fiction', 'Mystery', 'Romance',
  'Science Fiction', 'Fantasy', 'Biography', 'Self-Help',
  'History', 'Children', 'Young Adult', 'Horror', 'Poetry',
];

const CONDITIONS = [
  { value: '', label: 'Any Condition' },
  { value: 'new', label: 'New' },
  { value: 'like-new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
];

const SORT_OPTIONS = [
  { value: 'createdAt', order: 'desc', label: 'Newest First' },
  { value: 'price', order: 'asc', label: 'Price: Low to High' },
  { value: 'price', order: 'desc', label: 'Price: High to Low' },
  { value: 'rating', order: 'desc', label: 'Top Rated' },
];

interface Book {
  id: string;
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
}

interface PaginationInfo {
  page: number;
  pages: number;
  total: number;
}

export default function ShopContent() {
  const searchParams = useSearchParams();

  const [books, setBooks] = useState<Book[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [genre, setGenre] = useState(searchParams.get('genre') || 'All');
  const [condition, setCondition] = useState(searchParams.get('condition') || '');
  const [sort, setSort] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [bestseller, setBestseller] = useState(searchParams.get('bestseller') === 'true');
  const [showFilters, setShowFilters] = useState(false);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (genre && genre !== 'All') params.set('genre', genre);
      if (condition) params.set('condition', condition);
      if (bestseller) params.set('bestseller', 'true');
      params.set('sort', sort);
      params.set('order', sortOrder);
      params.set('page', page.toString());
      params.set('limit', '24');

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setBooks(data.books || []);
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, genre, condition, bestseller, sort, sortOrder, page]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  function handleSortChange(value: string) {
    const opt = SORT_OPTIONS.find(o => `${o.value}-${o.order}` === value);
    if (opt) {
      setSort(opt.value);
      setSortOrder(opt.order);
      setPage(1);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
  }

  function handleGenreChange(g: string) {
    setGenre(g);
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-white border-b border-brand-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-serif text-brand-950">
            {bestseller ? 'Bestsellers' : genre !== 'All' ? genre : 'All Books'}
          </h1>
          <p className="text-brand-500 mt-1">
            {pagination.total > 0 ? `${pagination.total} books found` : 'Explore our collection'}
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="mt-4 flex gap-2 max-w-lg">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by title, author..."
                className="w-full pl-9 pr-4 py-2.5 border border-brand-200 rounded-pill text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-pill hover:bg-brand-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters (desktop) */}
          <aside className="hidden lg:block w-56 flex-shrink-0 space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-3">Genre</h3>
              <ul className="space-y-1">
                {GENRES.map(g => (
                  <li key={g}>
                    <button
                      onClick={() => handleGenreChange(g)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        genre === g
                          ? 'bg-brand-100 text-brand-700 font-medium'
                          : 'text-brand-500 hover:bg-brand-50 hover:text-brand-700'
                      }`}
                    >
                      {g}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-3">Condition</h3>
              <ul className="space-y-1">
                {CONDITIONS.map(c => (
                  <li key={c.value}>
                    <button
                      onClick={() => { setCondition(c.value); setPage(1); }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        condition === c.value
                          ? 'bg-brand-100 text-brand-700 font-medium'
                          : 'text-brand-500 hover:bg-brand-50 hover:text-brand-700'
                      }`}
                    >
                      {c.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-3">Quick Filters</h3>
              <button
                onClick={() => { setBestseller(!bestseller); setPage(1); }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm w-full transition-colors ${
                  bestseller ? 'bg-amber-100 text-amber-700 font-medium' : 'text-brand-500 hover:bg-brand-50'
                }`}
              >
                <span>⭐</span> Bestsellers Only
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-brand-200 rounded-pill text-sm text-brand-600 hover:border-brand-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </button>

              <div className="ml-auto flex items-center gap-2">
                <span className="text-sm text-brand-400 hidden sm:block">Sort:</span>
                <select
                  value={`${sort}-${sortOrder}`}
                  onChange={e => handleSortChange(e.target.value)}
                  className="text-sm border border-brand-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-400 text-brand-700"
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={`${o.value}-${o.order}`} value={`${o.value}-${o.order}`}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mobile Filters Panel */}
            {showFilters && (
              <div className="lg:hidden mb-6 p-4 bg-white rounded-card border border-brand-100 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {GENRES.map(g => (
                    <button
                      key={g}
                      onClick={() => { handleGenreChange(g); setShowFilters(false); }}
                      className={`px-3 py-1 rounded-pill text-xs font-medium transition-colors ${
                        genre === g ? 'bg-brand-600 text-white' : 'bg-brand-100 text-brand-600 hover:bg-brand-200'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {CONDITIONS.map(c => (
                    <button
                      key={c.value}
                      onClick={() => { setCondition(c.value); setPage(1); setShowFilters(false); }}
                      className={`px-3 py-1 rounded-pill text-xs font-medium transition-colors ${
                        condition === c.value ? 'bg-brand-600 text-white' : 'bg-brand-100 text-brand-600 hover:bg-brand-200'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Active Filters */}
            {(genre !== 'All' || condition || bestseller || search) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {genre !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-100 text-brand-700 rounded-pill text-xs font-medium">
                    {genre}
                    <button onClick={() => setGenre('All')} className="hover:text-brand-900">×</button>
                  </span>
                )}
                {condition && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-100 text-brand-700 rounded-pill text-xs font-medium">
                    {CONDITIONS.find(c => c.value === condition)?.label}
                    <button onClick={() => setCondition('')} className="hover:text-brand-900">×</button>
                  </span>
                )}
                {bestseller && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-pill text-xs font-medium">
                    Bestsellers
                    <button onClick={() => setBestseller(false)} className="hover:text-amber-900">×</button>
                  </span>
                )}
                {search && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-100 text-brand-700 rounded-pill text-xs font-medium">
                    &ldquo;{search}&rdquo;
                    <button onClick={() => { setSearch(''); setPage(1); }} className="hover:text-brand-900">×</button>
                  </span>
                )}
              </div>
            )}

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-card border border-brand-100 overflow-hidden animate-pulse">
                    <div className="aspect-[2/3] bg-brand-100" />
                    <div className="p-3 space-y-2">
                      <div className="h-3 bg-brand-100 rounded w-3/4" />
                      <div className="h-3 bg-brand-100 rounded w-1/2" />
                      <div className="h-4 bg-brand-100 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : books.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-brand-950 mb-2">No books found</h3>
                <p className="text-brand-500">Try adjusting your filters or search terms</p>
                <button
                  onClick={() => { setGenre('All'); setCondition(''); setBestseller(false); setSearch(''); setPage(1); }}
                  className="mt-4 px-5 py-2 bg-brand-600 text-white text-sm font-medium rounded-pill hover:bg-brand-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {books.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-brand-200 rounded-lg text-sm text-brand-600 hover:border-brand-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(7, pagination.pages) }, (_, i) => {
                    let p: number;
                    if (pagination.pages <= 7) p = i + 1;
                    else if (page <= 4) p = i + 1;
                    else if (page >= pagination.pages - 3) p = pagination.pages - 6 + i;
                    else p = page - 3 + i;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                          p === page
                            ? 'bg-brand-600 text-white'
                            : 'border border-brand-200 text-brand-600 hover:border-brand-400'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="px-4 py-2 border border-brand-200 rounded-lg text-sm text-brand-600 hover:border-brand-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
