import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "lib/supabase-admin";

// GET /api/study-groups?subject=Math&userId=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const subject = searchParams.get("subject");
  const userId = searchParams.get("userId");
  const myGroups = searchParams.get("myGroups");

  let query = supabaseAdmin
    .from("study_groups")
    .select(
      `
      *,
      owner:user_profiles!study_groups_owner_id_fkey (display_name, avatar_url),
      study_group_members (count)
    `,
    )
    .order("created_at", { ascending: false });

  if (subject) query = query.eq("subject", subject);
  if (myGroups === "true" && userId) {
    const { data: memberGroups } = await supabaseAdmin
      .from("study_group_members")
      .select("group_id")
      .eq("user_id", userId);
    const groupIds = memberGroups?.map((m) => m.group_id) || [];
    query = query.in("id", groupIds);
  } else {
    query = query.eq("is_private", false);
  }

  const { data, error } = await query;
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ groups: data });
}

// POST /api/study-groups — create a group
export async function POST(req: NextRequest) {
  const { name, description, subject, ownerId, maxMembers, isPrivate } =
    await req.json();
  if (!name || !subject || !ownerId)
    return NextResponse.json(
      { error: "name, subject, ownerId required" },
      { status: 400 },
    );

  const { data: group, error } = await supabaseAdmin
    .from("study_groups")
    .insert({
      name,
      description,
      subject,
      owner_id: ownerId,
      max_members: maxMembers || 10,
      is_private: isPrivate || false,
    })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  // Auto-add owner as a member with role 'owner'
  await supabaseAdmin.from("study_group_members").insert({
    group_id: group.id,
    user_id: ownerId,
    role: "owner",
  });

  // Award XP for creating a group
  await supabaseAdmin.rpc("award_xp", {
    p_user_id: ownerId,
    p_amount: 30,
    p_reason: "Created a study group",
  });

  return NextResponse.json({ group });
}

// DELETE /api/study-groups?groupId=xxx&userId=xxx
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");
  const userId = searchParams.get("userId");
  if (!groupId || !userId)
    return NextResponse.json(
      { error: "groupId and userId required" },
      { status: 400 },
    );

  const { error } = await supabaseAdmin
    .from("study_groups")
    .delete()
    .eq("id", groupId)
    .eq("owner_id", userId);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
