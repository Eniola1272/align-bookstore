import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import connectDB from '@/lib/db/mongodb';
import { Order } from '@/lib/db/models/Order';
import { Book } from '@/lib/db/models/Book';

function generateOrderNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${ts}-${rand}`;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const orders = await Order.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { items, shippingAddress } = await req.json();

    if (!items?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Validate stock and prices
    const bookIds = items.map((i: { bookId: string }) => i.bookId);
    const books = await Book.find({ _id: { $in: bookIds } });
    const bookMap = new Map(books.map(b => [b._id.toString(), b]));

    let subtotal = 0;
    const orderItems: Array<{
      bookId: unknown;
      title: string;
      author: string;
      coverImage: string;
      price: number;
      quantity: number;
    }> = [];

    for (const item of items) {
      const book = bookMap.get(item.bookId);
      if (!book) return NextResponse.json({ error: `Book ${item.bookId} not found` }, { status: 400 });
      if (book.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for "${book.title}"` }, { status: 400 });
      }
      subtotal += book.price * item.quantity;
      orderItems.push({
        bookId: book._id,
        title: book.title,
        author: book.author,
        coverImage: book.coverImage,
        price: book.price,
        quantity: item.quantity,
      });
    }

    const shippingCost = subtotal >= 50 ? 0 : 5;
    const total = subtotal + shippingCost;

    const order = await Order.create({
      userId: session.user.id,
      orderNumber: generateOrderNumber(),
      items: orderItems,
      shippingAddress,
      subtotal,
      shippingCost,
      total,
    });

    // Decrement stock
    for (const item of items) {
      await Book.findByIdAndUpdate(item.bookId, { $inc: { stock: -item.quantity } });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Order POST error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
