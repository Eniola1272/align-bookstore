import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/adminCheck';
import connectDB from '@/lib/db/mongodb';
import { Order } from '@/lib/db/models/Order';

export async function GET(req: NextRequest) {
  const { adminError } = await requireAdmin();
  if (adminError) return adminError;

  await connectDB();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  const query: Record<string, unknown> = {};
  if (status && status !== 'all') query.status = status;

  const skip = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Order.countDocuments(query),
  ]);

  return NextResponse.json({
    orders,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}
