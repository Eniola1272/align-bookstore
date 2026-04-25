import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { getProfileById, createProfile } from '@/lib/supabase/queries';

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const existing = await getProfileById(data.user.id);
      if (!existing) {
        const meta = data.user.user_metadata ?? {};
        const username = (data.user.email!.split('@')[0] + Math.random().toString(36).slice(2, 5)).toLowerCase();
        await createProfile({
          id: data.user.id,
          name: meta.full_name || meta.name || data.user.email!.split('@')[0],
          username,
          avatar: meta.avatar_url || meta.picture || null,
          role: 'user',
        });
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/signin?error=auth`);
}
