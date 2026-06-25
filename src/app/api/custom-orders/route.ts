import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth/session';
import { createCustomOrder, getCustomOrdersByUser } from '@/lib/supabase/queries';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, bookTitle, bookAuthor, isbn, quantity, notes } = body;

    // Validate required fields
    if (!name?.trim()) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    if (!email?.trim()) return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    if (!phone?.trim()) return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    if (!bookTitle?.trim()) return NextResponse.json({ error: 'Book title is required' }, { status: 400 });

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });

    // Check if user is authenticated (optional — guests can also submit)
    const user = await getUser();

    const customOrder = await createCustomOrder({
      userId: user?.id ?? null,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      bookTitle: bookTitle.trim(),
      bookAuthor: bookAuthor?.trim() ?? '',
      isbn: isbn?.trim() ?? '',
      quantity: Math.max(1, Number(quantity) || 1),
      notes: notes?.trim() ?? '',
    });

    return NextResponse.json(customOrder, { status: 201 });
  } catch (error) {
    console.error('Custom order POST error:', error);
    return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 });
  }
}

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const orders = await getCustomOrdersByUser(user.id);
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Custom orders GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
  }
}
