import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/session';
import { getOrdersByUser, createOrder, getBooks } from '@/lib/supabase/queries';
import { calculateShipping } from '@/lib/shipping';

function generateOrderNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${ts}-${rand}`;
}

export async function GET() {
  const { authError, user } = await requireUser();
  if (authError) return authError;
  const orders = await getOrdersByUser(user!.id);
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const { authError, user } = await requireUser();
  if (authError) return authError;

  try {
    const { items, shippingAddress } = await req.json();
    if (!items?.length) return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });

    const bookIds: string[] = items.map((i: { bookId: string }) => i.bookId);
    const books = await getBooks({ where: {} });
    const bookMap = new Map(books.filter(b => bookIds.includes(b.id)).map(b => [b.id, b]));

    let subtotal = 0;
    const orderItems: { bookId: string; title: string; author: string; coverImage: string; price: number; quantity: number }[] = [];

    for (const item of items) {
      const book = bookMap.get(item.bookId);
      if (!book) return NextResponse.json({ error: 'Book not found' }, { status: 400 });
      if (book.stock < item.quantity) return NextResponse.json({ error: `Insufficient stock for "${book.title}"` }, { status: 400 });
      subtotal += book.price * item.quantity;
      orderItems.push({ bookId: book.id, title: book.title, author: book.author, coverImage: book.coverImage, price: book.price, quantity: item.quantity });
    }

    const shippingCost = calculateShipping(subtotal, shippingAddress?.city || '');
    const order = await createOrder({
      userId: user!.id,
      orderNumber: generateOrderNumber(),
      items: orderItems,
      shippingAddress,
      subtotal,
      shippingCost,
      total: subtotal + shippingCost,
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Order POST error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
