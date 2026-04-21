'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export interface BookFormData {
  title: string;
  author: string;
  description: string;
  price: string;
  originalPrice: string;
  isbn: string;
  genre: string;
  subGenre: string;
  publisher: string;
  publishedYear: string;
  pages: string;
  language: string;
  condition: string;
  coverImage: string;
  stock: string;
  featured: boolean;
  bestseller: boolean;
  tags: string;
}

const GENRES = [
  'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction',
  'Fantasy', 'Historical Fiction', 'Biography', 'Self-Help', 'Philosophy',
  'Poetry', 'Children', 'Young Adult', 'Horror', 'Thriller', 'Other',
];

const empty: BookFormData = {
  title: '', author: '', description: '', price: '', originalPrice: '',
  isbn: '', genre: 'Fiction', subGenre: '', publisher: '', publishedYear: '',
  pages: '', language: 'English', condition: 'new', coverImage: '',
  stock: '10', featured: false, bestseller: false, tags: '',
};

interface Props {
  initialData?: Partial<BookFormData>;
  bookId?: string;
}

export default function BookForm({ initialData, bookId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<BookFormData>({ ...empty, ...initialData });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewError, setPreviewError] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    if (name === 'coverImage') setPreviewError(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      title: form.title.trim(),
      author: form.author.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price),
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
      isbn: form.isbn.trim() || undefined,
      genre: form.genre,
      subGenre: form.subGenre.trim() || undefined,
      publisher: form.publisher.trim() || undefined,
      publishedYear: form.publishedYear ? parseInt(form.publishedYear) : undefined,
      pages: form.pages ? parseInt(form.pages) : undefined,
      language: form.language,
      condition: form.condition,
      coverImage: form.coverImage.trim() || '/book-placeholder.png',
      stock: parseInt(form.stock),
      featured: form.featured,
      bestseller: form.bestseller,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    };

    const res = await fetch(
      bookId ? `/api/products/${bookId}` : '/api/products',
      {
        method: bookId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || 'Failed to save book.');
      return;
    }

    router.push('/admin/books');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Book Details</h2>
            <Field label="Title *">
              <input name="title" value={form.title} onChange={handleChange} required className={input} placeholder="The Great Gatsby" />
            </Field>
            <Field label="Author *">
              <input name="author" value={form.author} onChange={handleChange} required className={input} placeholder="F. Scott Fitzgerald" />
            </Field>
            <Field label="Description">
              <textarea name="description" value={form.description} onChange={handleChange} rows={4} className={input} placeholder="A brief description of the book…" />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Genre *">
                <select name="genre" value={form.genre} onChange={handleChange} className={input}>
                  {GENRES.map(g => <option key={g}>{g}</option>)}
                </select>
              </Field>
              <Field label="Sub-genre">
                <input name="subGenre" value={form.subGenre} onChange={handleChange} className={input} placeholder="e.g. Literary Fiction" />
              </Field>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Publisher">
                <input name="publisher" value={form.publisher} onChange={handleChange} className={input} placeholder="Penguin Books" />
              </Field>
              <Field label="Year">
                <input name="publishedYear" type="number" value={form.publishedYear} onChange={handleChange} className={input} placeholder="2024" min="1000" max={new Date().getFullYear()} />
              </Field>
              <Field label="Pages">
                <input name="pages" type="number" value={form.pages} onChange={handleChange} className={input} placeholder="320" min="1" />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="ISBN">
                <input name="isbn" value={form.isbn} onChange={handleChange} className={input} placeholder="978-0-00-000000-0" />
              </Field>
              <Field label="Language">
                <input name="language" value={form.language} onChange={handleChange} className={input} placeholder="English" />
              </Field>
            </div>
            <Field label="Tags (comma-separated)">
              <input name="tags" value={form.tags} onChange={handleChange} className={input} placeholder="classic, must-read, award-winner" />
            </Field>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Cover */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Cover Image</h2>
            <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
              {form.coverImage && !previewError ? (
                <Image
                  src={form.coverImage}
                  alt="Cover preview"
                  fill
                  className="object-cover"
                  onError={() => setPreviewError(true)}
                />
              ) : (
                <div className="text-center text-gray-300 text-sm px-4">
                  <svg className="w-10 h-10 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {previewError ? 'Image failed to load' : 'Preview'}
                </div>
              )}
            </div>
            <Field label="Image URL">
              <input
                name="coverImage"
                value={form.coverImage}
                onChange={handleChange}
                className={input}
                placeholder="https://covers.openlibrary.org/…"
              />
            </Field>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Pricing & Stock</h2>
            <Field label="Price (₦) *">
              <input name="price" type="number" value={form.price} onChange={handleChange} required min="0" step="50" className={input} placeholder="19500" />
            </Field>
            <Field label="Original Price (₦)">
              <input name="originalPrice" type="number" value={form.originalPrice} onChange={handleChange} min="0" step="50" className={input} placeholder="25000" />
            </Field>
            <Field label="Stock *">
              <input name="stock" type="number" value={form.stock} onChange={handleChange} required min="0" className={input} />
            </Field>
            <Field label="Condition *">
              <select name="condition" value={form.condition} onChange={handleChange} className={input}>
                <option value="new">New</option>
                <option value="like-new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
            </Field>
          </div>

          {/* Flags */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
            <h2 className="font-semibold text-gray-900 mb-1">Visibility</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 accent-brand-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Featured</p>
                <p className="text-xs text-gray-400">Show on homepage featured section</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="bestseller" checked={form.bestseller} onChange={handleChange} className="w-4 h-4 accent-brand-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Bestseller</p>
                <p className="text-xs text-gray-400">Show bestseller badge on card</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={() => router.push('/admin/books')}
          className="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {bookId ? 'Save Changes' : 'Add Book'}
        </button>
      </div>
    </form>
  );
}

const input = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 bg-white';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}
