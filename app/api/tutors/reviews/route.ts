import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "lib/supabase-admin";

// GET /api/tutors/reviews?tutorId=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tutorId = searchParams.get("tutorId");
  if (!tutorId)
    return NextResponse.json({ error: "tutorId required" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("tutor_reviews")
    .select(`*, user_profiles (display_name, avatar_url)`)
    .eq("tutor_id", tutorId)
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ reviews: data });
}

// POST /api/tutors/reviews — submit a review
export async function POST(req: NextRequest) {
  const { tutorId, studentId, rating, comment } = await req.json();
  if (!tutorId || !studentId || !rating)
    return NextResponse.json(
      { error: "tutorId, studentId, rating required" },
      { status: 400 },
    );

  // Check if student already reviewed this tutor
  const { data: existing } = await supabaseAdmin
    .from("tutor_reviews")
    .select("id")
    .eq("tutor_id", tutorId)
    .eq("student_id", studentId)
    .single();

  if (existing)
    return NextResponse.json(
      { error: "You have already reviewed this tutor" },
      { status: 400 },
    );

  const { data, error } = await supabaseAdmin
    .from("tutor_reviews")
    .insert({ tutor_id: tutorId, student_id: studentId, rating, comment })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  // Award XP to student for leaving a review
  await supabaseAdmin.rpc("award_xp", {
    p_user_id: studentId,
    p_amount: 25,
    p_reason: "Left a tutor review",
  });

  return NextResponse.json({ review: data });
}
