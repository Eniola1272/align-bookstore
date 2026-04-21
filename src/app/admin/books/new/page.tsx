import Link from 'next/link';
import BookForm from '@/components/admin/BookForm';

export const metadata = { title: 'Add Book — Admin' };

export default function NewBookPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-3">
          <Link href="/admin/books" className="hover:text-gray-600">Books</Link>
          <span>/</span>
          <span className="text-gray-700">Add Book</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">Add New Book</h1>
      </div>
      <BookForm />
    </div>
  );
}
