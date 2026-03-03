import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "lib/supabase-admin";

// GET /api/sessions?userId=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId)
    return NextResponse.json({ error: "userId required" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("chat_sessions")
    .select("*, chat_messages(count)")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(20);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ sessions: data });
}

// POST /api/sessions — create session
export async function POST(req: NextRequest) {
  const { userId, title, subject } = await req.json();
  if (!userId)
    return NextResponse.json({ error: "userId required" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("chat_sessions")
    .insert({
      user_id: userId,
      title: title || "New Session",
      subject: subject || "General",
    })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ session: data });
}

// DELETE /api/sessions?sessionId=xxx&userId=xxx
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  const userId = searchParams.get("userId");
  if (!sessionId || !userId)
    return NextResponse.json(
      { error: "sessionId and userId required" },
      { status: 400 },
    );

  await supabaseAdmin
    .from("chat_messages")
    .delete()
    .eq("session_id", sessionId);
  await supabaseAdmin
    .from("chat_sessions")
    .delete()
    .eq("id", sessionId)
    .eq("user_id", userId);
  return NextResponse.json({ success: true });
}
