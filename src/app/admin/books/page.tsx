'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  price: number;
  originalPrice?: number;
  stock: number;
  condition: string;
  featured: boolean;
  bestseller: boolean;
  coverImage?: string;
}

const conditionColors: Record<string, string> = {
  new: 'bg-green-100 text-green-700',
  'like-new': 'bg-teal-100 text-teal-700',
  good: 'bg-blue-100 text-blue-700',
  fair: 'bg-orange-100 text-orange-700',
};

export default function AdminBooksPage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (search) params.set('search', search);
    const res = await fetch(`/api/products?${params}`);
    const data = await res.json();
    setBooks(data.books || []);
    setTotal(data.pagination?.total || 0);
    setLoading(false);
  }, [page, search]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setBooks(prev => prev.filter(b => b._id !== id));
      setTotal(prev => prev - 1);
      toast.success(`"${title}" removed from catalog.`);
    } else {
      toast.error('Failed to delete book. Please try again.');
    }
    setDeleting(null);
  }

  const pages = Math.ceil(total / 20);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Books</h1>
          <p className="text-gray-500 text-sm mt-0.5">{total.toLocaleString()} total</p>
        </div>
        <Link
          href="/admin/books/new"
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Book
        </Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-5">
        <input
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder="Search by title or author…"
          className="flex-1 max-w-sm px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          Search
        </button>
        {search && (
          <button
            type="button"
            onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }}
            className="px-3 py-2 text-gray-400 hover:text-gray-600 text-sm"
          >
            Clear
          </button>
        )}
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-6 h-6 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No books found</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 w-12"></th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Genre</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Price</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Stock</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Condition</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {books.map(book => (
                <tr key={book._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="relative w-8 h-11 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={book.coverImage || '/book-placeholder.png'}
                        alt={book.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 line-clamp-1">{book.title}</p>
                    <p className="text-gray-400 text-xs">{book.author}</p>
                    <div className="flex gap-1 mt-1">
                      {book.featured && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">Featured</span>}
                      {book.bestseller && <span className="text-xs bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full">Bestseller</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{book.genre}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900">₦{book.price.toLocaleString()}</p>
                    {book.originalPrice && book.originalPrice > book.price && (
                      <p className="text-gray-400 text-xs line-through">₦{book.originalPrice.toLocaleString()}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-medium text-xs px-2 py-0.5 rounded-full ${
                      book.stock === 0
                        ? 'bg-red-100 text-red-600'
                        : book.stock <= 5
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {book.stock === 0 ? 'Out' : book.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium ${conditionColors[book.condition] || 'bg-gray-100 text-gray-600'}`}>
                      {book.condition}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => router.push(`/admin/books/${book._id}/edit`)}
                        className="px-3 py-1.5 text-xs font-medium text-brand-600 border border-brand-200 rounded-lg hover:bg-brand-50 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(book._id, book.title)}
                        disabled={deleting === book._id}
                        className="px-3 py-1.5 text-xs font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {deleting === book._id ? '…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">Page {page} of {pages}</p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
