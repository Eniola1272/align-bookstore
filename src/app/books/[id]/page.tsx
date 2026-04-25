import { notFound } from 'next/navigation';
import { getBookById, getBooks } from '@/lib/supabase/queries';
import BookDetailClient from './BookDetailClient';

export default async function BookDetailPage({ params }: { params: { id: string } }) {
  const book = await getBookById(params.id);
  if (!book) notFound();

  const relatedBooks = await getBooks({
    where: { genre: book.genre, stock: { gt: 0 } },
    take: 5,
  }).then(books => books.filter(b => b.id !== book.id).slice(0, 4)).catch(() => []);

  return <BookDetailClient book={book} relatedBooks={relatedBooks} />;
}
