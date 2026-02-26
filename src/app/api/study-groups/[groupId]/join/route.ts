import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// POST /api/study-groups/[groupId]/join
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ groupId: string }> }
) {
  const { groupId } = await context.params;
  const { userId, inviteCode } = await req.json();
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

  // Get group info
  const { data: group, error: groupError } = await supabaseAdmin
    .from('study_groups').select('*').eq('id', groupId).single();

  if (groupError || !group) return NextResponse.json({ error: 'Group not found' }, { status: 404 });

  // Check private group invite code
  if (group.is_private && group.invite_code !== inviteCode)
    return NextResponse.json({ error: 'Invalid invite code' }, { status: 403 });

  // Check if already a member
  const { data: existing } = await supabaseAdmin
    .from('study_group_members').select('id').eq('group_id', groupId).eq('user_id', userId).single();

  if (existing) return NextResponse.json({ error: 'Already a member' }, { status: 400 });

  // Check max members
  const { count } = await supabaseAdmin
    .from('study_group_members').select('*', { count: 'exact', head: true }).eq('group_id', groupId);

  if (count && count >= group.max_members)
    return NextResponse.json({ error: 'Group is full' }, { status: 400 });

  // Join the group
  const { error } = await supabaseAdmin
    .from('study_group_members').insert({ group_id: groupId, user_id: userId, role: 'member' });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Notify group owner
  await supabaseAdmin.from('notifications').insert({
    user_id: group.owner_id,
    title: 'New Member Joined',
    message: `Someone joined your study group "${group.name}"`,
    type: 'group',
    link: `/study-groups/${groupId}`,
  });

  // Award XP for joining a group
  await supabaseAdmin.rpc('award_xp', { p_user_id: userId, p_amount: 20, p_reason: 'Joined a study group' });

  return NextResponse.json({ success: true });
}

// DELETE /api/study-groups/[groupId]/join — leave group
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ groupId: string }> }
) {
  const { groupId } = await context.params;
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

  const { error } = await supabaseAdmin
    .from('study_group_members').delete().eq('group_id', groupId).eq('user_id', userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
