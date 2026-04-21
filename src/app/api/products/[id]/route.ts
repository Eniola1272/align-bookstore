import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import { Book } from '@/lib/db/models/Book';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const book = await Book.findById(params.id).lean();
    if (!book) return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    return NextResponse.json(book);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch book' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await req.json();
    const book = await Book.findByIdAndUpdate(params.id, body, { new: true }).lean();
    if (!book) return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    return NextResponse.json(book);
  } catch {
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
  }
}
