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
    }
  );

  const data = await response.json();

  let updated = 0;

  for (const match of data.matches ?? []) {
    const { error } = await supabase
      .from("matches")
      .update({
        status: match.status.toLowerCase(),
        home_score: match.score.fullTime.home,
        away_score: match.score.fullTime.away,
        home_team: match.homeTeam?.name || "TBD",
        away_team: match.awayTeam?.name || "TBD",
      })
      .eq("api_match_id", String(match.id));

    if (!error) updated++;
  }

  return NextResponse.json({
    message: "Scores updated",
    updated,
  });
}