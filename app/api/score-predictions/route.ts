import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function getResult(home: number, away: number) {
  if (home > away) return "home";
  if (away > home) return "away";
  return "draw";
}

export async function GET() {
  const { data: predictions, error: predictionsError } = await supabase
    .from("predictions")
    .select("*");

  if (predictionsError) {
    return NextResponse.json({ error: predictionsError.message }, { status: 500 });
  }

  const { data: matches, error: matchesError } = await supabase
    .from("matches")
    .select("*")
    .not("home_score", "is", null)
    .not("away_score", "is", null);

  if (matchesError) {
    return NextResponse.json({ error: matchesError.message }, { status: 500 });
  }

  let updated = 0;

  for (const prediction of predictions ?? []) {
    const match = matches?.find((m) => m.id === prediction.match_id);

    if (!match) continue;

    let points = 0;

    if (
      prediction.predicted_home_score === match.home_score &&
      prediction.predicted_away_score === match.away_score
    ) {
      points = 3;
    } else {
      const predictedResult = getResult(
        prediction.predicted_home_score,
        prediction.predicted_away_score
      );

      const actualResult = getResult(match.home_score, match.away_score);

      if (predictedResult === actualResult) {
        points = 1;
      }
    }

    const { error } = await supabase
      .from("predictions")
      .update({ points })
      .eq("id", prediction.id);

    if (!error) updated++;
  }

  return NextResponse.json({
    message: "Predictions scored",
    updated,
  });
}