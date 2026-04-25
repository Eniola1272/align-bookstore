import { NextRequest, NextResponse } from 'next/server';
import { requireUser, requireAdmin } from '@/lib/auth/session';
import { getProfileById, getOrderById, updateOrder } from '@/lib/supabase/queries';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { authError, user } = await requireUser();
  if (authError) return authError;

  const profile = await getProfileById(user!.id);
  const isAdmin = profile?.role === 'admin';

  const order = await getOrderById(params.id, isAdmin ? undefined : user!.id);
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  return NextResponse.json(order);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { adminError } = await requireAdmin();
  if (adminError) return adminError;

  try {
    const { status, paymentStatus, notes } = await req.json();
    const order = await updateOrder(params.id, { status, paymentStatus, notes });
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
