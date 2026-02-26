import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET /api/study-groups/[groupId]/messages
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ groupId: string }> }
) {
  const { groupId } = await context.params;

  const { data, error } = await supabaseAdmin
    .from('study_group_messages')
    .select(`*, user_profiles (display_name, avatar_url)`)
    .eq('group_id', groupId)
    .order('created_at', { ascending: true })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ messages: data });
}

// POST /api/study-groups/[groupId]/messages — send a message
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ groupId: string }> }
) {
  const { groupId } = await context.params;
  const { userId, content } = await req.json();
  if (!userId || !content) return NextResponse.json({ error: 'userId and content required' }, { status: 400 });

  // Verify user is a member
  const { data: member } = await supabaseAdmin
    .from('study_group_members').select('id').eq('group_id', groupId).eq('user_id', userId).single();

  if (!member) return NextResponse.json({ error: 'You are not a member of this group' }, { status: 403 });

  const { data, error } = await supabaseAdmin
    .from('study_group_messages')
    .insert({ group_id: groupId, user_id: userId, content })
    .select(`*, user_profiles (display_name, avatar_url)`)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Small XP reward for engaging in group chat
  await supabaseAdmin.rpc('award_xp', { p_user_id: userId, p_amount: 5, p_reason: 'Sent a message in study group' });

  return NextResponse.json({ message: data });
}
