import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBookById } from '@/lib/supabase/queries';
import BookForm, { BookFormData } from '@/components/admin/BookForm';

export const metadata = { title: 'Edit Book — Admin' };

export default async function EditBookPage({ params }: { params: { id: string } }) {
  const book = await getBookById(params.id);
  if (!book) notFound();

  const initialData: Partial<BookFormData> = {
    title: book.title,
    author: book.author,
    description: book.description,
    price: String(book.price),
    originalPrice: book.originalPrice ? String(book.originalPrice) : '',
    isbn: book.isbn ?? '',
    genre: book.genre,
    subGenre: book.subGenre ?? '',
    publisher: book.publisher ?? '',
    publishedYear: book.publishedYear ? String(book.publishedYear) : '',
    pages: book.pages ? String(book.pages) : '',
    language: book.language,
    condition: book.condition,
    coverImage: book.coverImage,
    stock: String(book.stock),
    featured: book.featured,
    bestseller: book.bestseller,
    tags: book.tags.join(', '),
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
        <p className="text-gray-500 text-sm mt-0.5">{book.title}</p>
      </div>
      <BookForm initialData={initialData} bookId={params.id} />
    </div>
  );
}
