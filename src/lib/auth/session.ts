import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { getProfileById } from '@/lib/supabase/queries';

export async function getUser() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function requireUser() {
  const user = await getUser();
  if (!user) {
    return { authError: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), user: null };
  }
  return { authError: null, user };
}

export async function requireAdmin() {
  const user = await getUser();
  if (!user) {
    return { adminError: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), user: null };
  }
  const profile = await getProfileById(user.id);
  if (profile?.role !== 'admin') {
    return { adminError: NextResponse.json({ error: 'Forbidden' }, { status: 403 }), user: null };
  }
  return { adminError: null, user };
}
