import { getServerSession } from 'next-auth';
import { authOptions } from './authOptions';
import { NextResponse } from 'next/server';

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { adminError: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), session: null };
  }
  if (session.user.role !== 'admin') {
    return { adminError: NextResponse.json({ error: 'Forbidden' }, { status: 403 }), session: null };
  }
  return { adminError: null, session };
}
