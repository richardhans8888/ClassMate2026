import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "lib/supabase-admin";

// GET /api/bookings?userId=xxx&role=student|tutor
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const role = searchParams.get("role") || "student";
  if (!userId)
    return NextResponse.json({ error: "userId required" }, { status: 400 });

  let query = supabaseAdmin
    .from("bookings")
    .select(
      `
    *,
    tutors (
      id,
      subjects,
      user_profiles (display_name, avatar_url)
    ),
    student:user_profiles!bookings_student_id_fkey (display_name, avatar_url)
  `,
    )
    .order("scheduled_at", { ascending: true });

  if (role === "tutor") {
    const { data: tutorProfile } = await supabaseAdmin
      .from("tutors")
      .select("id")
      .eq("user_id", userId)
      .single();
    if (!tutorProfile) return NextResponse.json({ bookings: [] });
    query = query.eq("tutor_id", tutorProfile.id);
  } else {
    query = query.eq("student_id", userId);
  }

  const { data, error } = await query;
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ bookings: data });
}

// POST /api/bookings — create a booking
export async function POST(req: NextRequest) {
  const { tutorId, studentId, subject, scheduledAt, durationMinutes, notes } =
    await req.json();
  if (!tutorId || !studentId || !subject || !scheduledAt)
    return NextResponse.json(
      { error: "tutorId, studentId, subject, scheduledAt required" },
      { status: 400 },
    );

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .insert({
      tutor_id: tutorId,
      student_id: studentId,
      subject,
      scheduled_at: scheduledAt,
      duration_minutes: durationMinutes || 60,
      notes,
    })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  // Get tutor's user_id for notification
  const { data: tutor } = await supabaseAdmin
    .from("tutors")
    .select("user_id")
    .eq("id", tutorId)
    .single();

  if (tutor) {
    await supabaseAdmin.from("notifications").insert({
      user_id: tutor.user_id,
      title: "New Booking Request",
      message: `You have a new booking request for ${subject}`,
      type: "booking",
      link: "/bookings",
    });
  }

  // Award XP to student for booking a session
  await supabaseAdmin.rpc("award_xp", {
    p_user_id: studentId,
    p_amount: 50,
    p_reason: "Booked a tutor session",
  });

  return NextResponse.json({ booking: data });
}

// PATCH /api/bookings — update booking status
export async function PATCH(req: NextRequest) {
  const { bookingId, status, userId } = await req.json();
  if (!bookingId || !status)
    return NextResponse.json(
      { error: "bookingId and status required" },
      { status: 400 },
    );

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .update({ status })
    .eq("id", bookingId)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  // Notify student of status change
  if (data.student_id && status !== "pending") {
    await supabaseAdmin.from("notifications").insert({
      user_id: data.student_id,
      title: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your booking has been ${status}`,
      type: "booking",
      link: "/bookings",
    });
  }

  // Award XP when session is completed
  if (status === "completed") {
    await supabaseAdmin.rpc("award_xp", {
      p_user_id: data.student_id,
      p_amount: 100,
      p_reason: "Completed a tutoring session",
    });
    if (userId) {
      await supabaseAdmin.rpc("award_xp", {
        p_user_id: userId,
        p_amount: 75,
        p_reason: "Completed a tutoring session as tutor",
      });
    }
  }

  return NextResponse.json({ booking: data });
}
