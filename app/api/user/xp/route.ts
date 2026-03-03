import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "lib/supabase-admin";

// POST /api/user/xp — award XP to a user
export async function POST(req: NextRequest) {
  const { userId, amount, reason } = await req.json();
  if (!userId || !amount || !reason)
    return NextResponse.json(
      { error: "userId, amount, reason required" },
      { status: 400 },
    );

  const { error } = await supabaseAdmin.rpc("award_xp", {
    p_user_id: userId,
    p_amount: amount,
    p_reason: reason,
  });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  // Return updated profile
  const { data: profile } = await supabaseAdmin
    .from("user_profiles")
    .select("xp, level")
    .eq("id", userId)
    .single();

  return NextResponse.json({ success: true, profile });
}
