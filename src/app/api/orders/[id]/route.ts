import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
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
    const order = await Order.findOne({ _id: params.id, userId: session.user.id }).lean();
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}
