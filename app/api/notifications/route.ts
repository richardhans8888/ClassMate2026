import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "lib/supabase-admin";

// GET /api/notifications?userId=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId)
    return NextResponse.json({ error: "userId required" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(30);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ notifications: data });
}

// PATCH /api/notifications — mark as read
export async function PATCH(req: NextRequest) {
  const { userId, notificationId, markAllRead } = await req.json();
  if (!userId)
    return NextResponse.json({ error: "userId required" }, { status: 400 });

  if (markAllRead) {
    await supabaseAdmin
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId);
  } else if (notificationId) {
    await supabaseAdmin
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId)
      .eq("user_id", userId);
  }

  return NextResponse.json({ success: true });
}

// DELETE /api/notifications?notificationId=xxx&userId=xxx
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const notificationId = searchParams.get("notificationId");
  const userId = searchParams.get("userId");

  if (!notificationId || !userId)
    return NextResponse.json(
      { error: "notificationId and userId required" },
      { status: 400 },
    );

  await supabaseAdmin
    .from("notifications")
    .delete()
    .eq("id", notificationId)
    .eq("user_id", userId);
  return NextResponse.json({ success: true });
}
