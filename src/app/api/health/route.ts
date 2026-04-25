import { NextResponse } from 'next/server';
import { countProfiles } from '@/lib/supabase/queries';

export async function GET() {
  try {
    const users = await countProfiles();
    return NextResponse.json({ status: 'healthy', database: 'connected', users, timestamp: new Date().toISOString() });
  } catch (error: unknown) {
    return NextResponse.json(
      { status: 'error', database: 'disconnected', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
