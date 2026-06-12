import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const response = await fetch(
    "https://api.football-data.org/v4/competitions/WC/matches",
    {
      headers: {
        "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY!,
      },
      cache: "no-store",
    }
  );

  const data = await response.json();

  let updated = 0;
  let scored = 0;
  let stillMissingScores = 0;

  for (const match of data.matches ?? []) {
    const homeScore =
      match.score?.fullTime?.home ??
      match.score?.regularTime?.home ??
      null;

    const awayScore =
      match.score?.fullTime?.away ??
      match.score?.regularTime?.away ??
      null;

    if (homeScore !== null && awayScore !== null) {
      scored++;
    } else {
      stillMissingScores++;
    }

    const { error } = await supabase
      .from("matches")
      .update({
        status: match.status?.toLowerCase() ?? "scheduled",
        home_score: homeScore,
        away_score: awayScore,
        home_team: match.homeTeam?.name || "TBD",
        away_team: match.awayTeam?.name || "TBD",
      })
      .eq("api_match_id", String(match.id));

    if (!error) updated++;
  }

  return NextResponse.json({
    message: "Scores updated",
    updated,
    scored,
    stillMissingScores,
  });
}