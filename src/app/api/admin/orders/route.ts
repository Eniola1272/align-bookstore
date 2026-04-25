import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { getAllOrders, countOrders } from '@/lib/supabase/queries';

export async function GET(req: NextRequest) {
  const { adminError } = await requireAdmin();
  if (adminError) return adminError;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') ?? undefined;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    getAllOrders({ status, skip, take: limit }),
    countOrders({ status }),
  ]);

  return NextResponse.json({ orders, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}
