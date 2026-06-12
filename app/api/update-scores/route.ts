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

  if (!response.ok) {
    return NextResponse.json(
      {
        error: "Football API error",
        status: response.status,
        data,
      },
      { status: 500 }
    );
  }

  if (!data.matches || data.matches.length === 0) {
    return NextResponse.json({
      message: "No matches returned from Football API",
      matchCount: data.matches?.length ?? 0,
      data,
    });
  }

  let updated = 0;
  let scored = 0;
  let stillMissingScores = 0;
  let notMatchedInDatabase = 0;

  const samples: any[] = [];

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

    const updateData: any = {
      status: match.status?.toLowerCase() ?? "scheduled",
      home_team: match.homeTeam?.name || "TBD",
      away_team: match.awayTeam?.name || "TBD",
    };

    // Only update scores if the API actually has scores.
    // This prevents manual Supabase scores being wiped back to NULL.
    if (homeScore !== null && awayScore !== null) {
      updateData.home_score = homeScore;
      updateData.away_score = awayScore;
    }

    const { data: updatedRows, error } = await supabase
      .from("matches")
      .update(updateData)
      .eq("api_match_id", String(match.id))
      .select("id, api_match_id, home_team, away_team, home_score, away_score");

    if (error) {
      samples.push({
        api_match_id: match.id,
        error: error.message,
      });
      continue;
    }

    if (!updatedRows || updatedRows.length === 0) {
      notMatchedInDatabase++;

      if (samples.length < 5) {
        samples.push({
          api_match_id: match.id,
          api_home_team: match.homeTeam?.name,
          api_away_team: match.awayTeam?.name,
          note: "No matching row found in Supabase for this api_match_id",
        });
      }

      continue;
    }

    updated += updatedRows.length;

    if (samples.length < 5) {
      samples.push({
        api_match_id: match.id,
        updated_row: updatedRows[0],
        api_status: match.status,
        api_home_score: homeScore,
        api_away_score: awayScore,
      });
    }
  }

  return NextResponse.json({
    message: "Scores update checked",
    apiMatchCount: data.matches.length,
    updated,
    scored,
    stillMissingScores,
    notMatchedInDatabase,
    samples,
  });
}