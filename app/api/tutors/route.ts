import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "lib/supabase-admin";

// GET /api/tutors?subject=Math&search=john
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const subject = searchParams.get("subject");
  const search = searchParams.get("search");
  const available = searchParams.get("available");

  let query = supabaseAdmin
    .from("tutors")
    .select(
      `
      *,
      user_profiles (
        id, display_name, avatar_url, university, major
      )
    `,
    )
    .order("rating", { ascending: false });

  if (subject) query = query.contains("subjects", [subject]);
  if (available === "true") query = query.eq("is_available", true);

  const { data, error } = await query;
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  // Filter by name search if provided
  const filtered = search
    ? data.filter((t) =>
      (t.user_profiles as { display_name: string })?.display_name
        ?.toLowerCase()
        .includes(search.toLowerCase()),
    )
    : data;

  return NextResponse.json({ tutors: filtered });
}

// POST /api/tutors — register as a tutor
export async function POST(req: NextRequest) {
  const { userId, subjects, hourlyRate, bio, availability } = await req.json();
  if (!userId || !subjects)
    return NextResponse.json(
      { error: "userId and subjects required" },
      { status: 400 },
    );

  // Check if already a tutor
  const { data: existing } = await supabaseAdmin
    .from("tutors")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (existing) {
    // Update existing tutor profile
    const { data, error } = await supabaseAdmin
      .from("tutors")
      .update({ subjects, hourly_rate: hourlyRate, bio, availability })
      .eq("user_id", userId)
      .select()
      .single();
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ tutor: data });
  }

  // Create new tutor profile
  const { data, error } = await supabaseAdmin
    .from("tutors")
    .insert({
      user_id: userId,
      subjects,
      hourly_rate: hourlyRate,
      bio,
      availability,
    })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  // Update user role to tutor
  await supabaseAdmin
    .from("user_profiles")
    .update({ role: "tutor" })
    .eq("id", userId);

  return NextResponse.json({ tutor: data });
}
