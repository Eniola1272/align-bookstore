import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import connectDB from '@/lib/db/mongodb';
import { Order } from '@/lib/db/models/Order';
import { Book } from '@/lib/db/models/Book';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || '';

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

    const reference = new URL(req.url).searchParams.get('reference');
    if (!reference) {
      return NextResponse.json({ error: 'Missing payment reference' }, { status: 400 });
    }

    // Verify with Paystack
    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
      }
    );

    const verifyData = await verifyRes.json();

    if (!verifyData.status || verifyData.data.status !== 'success') {
      return NextResponse.json({ error: 'Payment not successful', status: verifyData.data?.status }, { status: 400 });
    }

    await connectDB();

    // Idempotency: don't create duplicate orders
    const existing = await Order.findOne({ stripePaymentIntentId: reference });
    if (existing) {
      return NextResponse.json({ order: existing });
    }

    const metadata = verifyData.data.metadata || {};
    const items = JSON.parse(metadata.items || '[]');
    const shippingAddress = JSON.parse(metadata.shippingAddress || '{}');
    const subtotal = metadata.subtotal ?? 0;
    const shippingCost = metadata.shippingCost ?? 0;
    const total = metadata.total ?? verifyData.data.amount / 100;

    // Decrement stock
    for (const item of items) {
      await Book.findByIdAndUpdate(item.bookId, { $inc: { stock: -item.quantity } });
    }

    const order = await Order.create({
      userId: session.user.id,
      orderNumber: generateOrderNumber(),
      items,
      shippingAddress,
      subtotal,
      shippingCost,
      total,
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'paystack',
      stripePaymentIntentId: reference, // reusing field to store reference
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
