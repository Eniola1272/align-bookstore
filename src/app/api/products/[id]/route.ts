import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { getBookById, updateBook, deleteBook } from '@/lib/supabase/queries';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const book = await getBookById(params.id);
    if (!book) return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    return NextResponse.json(book);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch book' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { adminError } = await requireAdmin();
  if (adminError) return adminError;
  try {
    const body = await req.json();
    const book = await updateBook(params.id, body);
    return NextResponse.json(book);
  } catch {
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { adminError } = await requireAdmin();
  if (adminError) return adminError;
  try {
    await deleteBook(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
  }
}
