import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/session';
import { calculateShipping } from '@/lib/shipping';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || '';
const PAYSTACK_INIT_URL = 'https://api.paystack.co/transaction/initialize';

export async function POST(req: NextRequest) {
  const { authError, user } = await requireUser();
  if (authError) return authError;

  try {
    const { items, shippingAddress } = await req.json();

    if (!items?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const subtotal: number = items.reduce(
      (sum: number, i: { price: number; quantity: number }) => sum + i.price * i.quantity,
      0
    );
    const shippingCost = calculateShipping(subtotal, shippingAddress?.city || '');
    const total = subtotal + shippingCost;
    const amountInKobo = Math.round(total * 100);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const reference = `ALIGN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const paystackRes = await fetch(PAYSTACK_INIT_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user!.email,
        amount: amountInKobo,
        reference,
        callback_url: `${baseUrl}/orders/success`,
        metadata: {
          userId: user!.id,
          items: JSON.stringify(items),
          shippingAddress: JSON.stringify(shippingAddress),
          subtotal,
          shippingCost,
          total,
          cancel_action: `${baseUrl}/cart`,
        },
      }),
    });

    const data = await paystackRes.json();

    if (!data.status) {
      return NextResponse.json({ error: data.message || 'Payment initialization failed' }, { status: 400 });
    }

    return NextResponse.json({ url: data.data.authorization_url, reference: data.data.reference });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Failed to initialize payment' }, { status: 500 });
  }
}
