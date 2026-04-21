import Link from 'next/link';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/db/mongodb';
import { Book } from '@/lib/db/models/Book';
import BookForm, { BookFormData } from '@/components/admin/BookForm';

export const metadata = { title: 'Edit Book — Admin' };

export default async function EditBookPage({ params }: { params: { id: string } }) {
  await connectDB();
  const book = await Book.findById(params.id).lean() as Record<string, unknown> | null;
  if (!book) notFound();

  const initialData: Partial<BookFormData> = {
    title: String(book.title || ''),
    author: String(book.author || ''),
    description: String(book.description || ''),
    price: String(book.price || ''),
    originalPrice: book.originalPrice ? String(book.originalPrice) : '',
    isbn: String(book.isbn || ''),
    genre: String(book.genre || 'Fiction'),
    subGenre: String(book.subGenre || ''),
    publisher: String(book.publisher || ''),
    publishedYear: book.publishedYear ? String(book.publishedYear) : '',
    pages: book.pages ? String(book.pages) : '',
    language: String(book.language || 'English'),
    condition: String(book.condition || 'new'),
    coverImage: String(book.coverImage || ''),
    stock: String(book.stock ?? 0),
    featured: Boolean(book.featured),
    bestseller: Boolean(book.bestseller),
    tags: Array.isArray(book.tags) ? (book.tags as string[]).join(', ') : '',
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-3">
          <Link href="/admin/books" className="hover:text-gray-600">Books</Link>
          <span>/</span>
          <span className="text-gray-700">Edit</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">Edit Book</h1>
        <p className="text-gray-500 text-sm mt-0.5">{initialData.title}</p>
      </div>
      <BookForm initialData={initialData} bookId={params.id} />
    </div>
  );
}
