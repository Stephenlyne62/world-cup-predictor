import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const response = await fetch(
    "https://api.football-data.org/v4/competitions/WC/matches",
    {
      headers: {
        "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY!,
      },
    }
  );

  const data = await response.json();

  const fixtures = data.matches.map((match: any) => ({
  api_match_id: String(match.id),
  home_team: match.homeTeam?.name || "TBD",
  away_team: match.awayTeam?.name || "TBD",
  kickoff_time: match.utcDate,
  status: match.status.toLowerCase(),
  home_score: match.score.fullTime.home,
  away_score: match.score.fullTime.away,
  }));

  const { error } = await supabase
    .from("matches")
    .upsert(fixtures, { onConflict: "api_match_id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    message: "Fixtures imported",
    count: fixtures.length,
  });
}