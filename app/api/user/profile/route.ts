import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "lib/supabase-admin";

// GET /api/user/profile?userId=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId)
    return NextResponse.json({ error: "userId required" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    profile: {
      ...data,
      xpProgress: data.xp % 500,
      xpForNextLevel: 500,
      progressPercent: Math.floor(((data.xp % 500) / 500) * 100),
    },
  });
}

// PATCH /api/user/profile — update profile
export async function PATCH(req: NextRequest) {
  const { userId, ...updates } = await req.json();
  if (!userId)
    return NextResponse.json({ error: "userId required" }, { status: 400 });

  const allowedFields = [
    "display_name",
    "bio",
    "university",
    "major",
    "avatar_url",
  ];
  const filtered = Object.fromEntries(
    Object.entries(updates).filter(([key]) => allowedFields.includes(key)),
  );

  const { data, error } = await supabaseAdmin
    .from("user_profiles")
    .update(filtered)
    .eq("id", userId)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profile: data });
}
