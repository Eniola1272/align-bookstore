import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/session';
import { getProfileById, getProfileByUsername, updateProfile } from '@/lib/supabase/queries';

export async function GET() {
  const { authError, user } = await requireUser();
  if (authError) return authError;

  const profile = await getProfileById(user!.id);
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  return NextResponse.json({
    user: {
      id: profile.id,
      name: profile.name,
      username: profile.username,
      email: user!.email,
      avatar: profile.avatar,
      role: profile.role,
    },
  });
}

export async function PATCH(req: NextRequest) {
  const { authError, user } = await requireUser();
  if (authError) return authError;

  const { name, username, avatar } = await req.json();

  if (username) {
    const taken = await getProfileByUsername(username, user!.id);
    if (taken) return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
  }

  const updated = await updateProfile(user!.id, {
    ...(name ? { name } : {}),
    ...(username ? { username } : {}),
    ...(avatar !== undefined ? { avatar } : {}),
  });

  return NextResponse.json({ success: true, user: updated });
}
