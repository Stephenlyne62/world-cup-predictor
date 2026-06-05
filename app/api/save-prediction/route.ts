import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { user_id, match_id, home_score, away_score } = body;

  if (!user_id || !match_id) {
    return NextResponse.json(
      { error: "Missing user or match." },
      { status: 400 }
    );
  }

  const { data: match, error: matchError } = await supabase
    .from("matches")
    .select("id, kickoff_time")
    .eq("id", match_id)
    .single();

  if (matchError || !match) {
    return NextResponse.json(
      { error: "Match not found." },
      { status: 404 }
    );
  }

  const now = new Date();
  const kickoff = new Date(match.kickoff_time);

  if (now >= kickoff) {
    return NextResponse.json(
      { error: "Predictions are locked for this match." },
      { status: 403 }
    );
  }

  const { error } = await supabase.from("predictions").upsert(
    {
      user_id,
      match_id,
      predicted_home_score: Number(home_score),
      predicted_away_score: Number(away_score),
    },
    {
      onConflict: "user_id,match_id",
    }
  );

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
  });
}