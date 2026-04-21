import { notFound } from 'next/navigation';
import connectDB from '@/lib/db/mongodb';
import { Book } from '@/lib/db/models/Book';
import BookDetailClient from './BookDetailClient';

interface BookDocument {
  _id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  originalPrice?: number;
  isbn?: string;
  genre: string;
  subGenre?: string;
  publisher?: string;
  publishedYear?: number;
  pages?: number;
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

async function getBook(id: string): Promise<BookDocument | null> {
  try {
    await connectDB();
    const book = await Book.findById(id).lean() as BookDocument | null;
    if (!book) return null;
    return JSON.parse(JSON.stringify(book));
  } catch {
    return null;
  }
}

async function getRelatedBooks(genre: string, excludeId: string): Promise<BookDocument[]> {
  try {
    await connectDB();
    const books = await Book.find({ genre, _id: { $ne: excludeId }, stock: { $gt: 0 } })
      .limit(4)
      .lean() as unknown as BookDocument[];
    return JSON.parse(JSON.stringify(books));
  } catch {
    return [];
  }
}

export default async function BookDetailPage({ params }: { params: { id: string } }) {
  const [book, relatedBooks] = await Promise.all([
    getBook(params.id),
    getBook(params.id).then(b => b ? getRelatedBooks(b.genre, params.id) : []),
  ]);

  if (!book) notFound();

  return <BookDetailClient book={book} relatedBooks={relatedBooks} />;
}
