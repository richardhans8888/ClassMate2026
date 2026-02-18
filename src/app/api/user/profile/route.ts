// src/app/api/user/profile/route.ts
// User XP, Level, and Profile management

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET: Fetch user profile (xp, level, stats)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('id, display_name, avatar_url, xp, level, total_sessions, created_at')
    .eq('id', userId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Calculate XP needed for next level
  const xpForNextLevel = profile.level * 500;
  const xpProgress = profile.xp % 500;

  return NextResponse.json({
    profile: {
      ...profile,
      xpProgress,
      xpForNextLevel,
      progressPercent: Math.floor((xpProgress / 500) * 100),
    },
  });
}

// POST: Create a new user profile (called on first sign-up)
export async function POST(req: NextRequest) {
  const { userId, displayName, avatarUrl } = await req.json();

  const { data: profile, error } = await supabase
    .from('user_profiles')
    .insert({
      id: userId,
      display_name: displayName,
      avatar_url: avatarUrl || null,
      xp: 0,
      level: 1,
      total_sessions: 0,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile });
}
