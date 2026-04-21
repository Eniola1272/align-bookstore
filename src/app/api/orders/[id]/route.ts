import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { requireAdmin } from '@/lib/auth/adminCheck';
import connectDB from '@/lib/db/mongodb';
import { Order } from '@/lib/db/models/Order';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Admins can view any order; users can only view their own
    const query =
      session.user.role === 'admin'
        ? { _id: params.id }
        : { _id: params.id, userId: session.user.id };

    const order = await Order.findOne(query).lean();
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { adminError } = await requireAdmin();
  if (adminError) return adminError;

  try {
    await connectDB();
    const { status, paymentStatus, notes } = await req.json();

    const update: Record<string, unknown> = {};
    if (status) update.status = status;
    if (paymentStatus) update.paymentStatus = paymentStatus;
    if (notes !== undefined) update.notes = notes;

    const order = await Order.findByIdAndUpdate(params.id, update, { new: true }).lean();
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
