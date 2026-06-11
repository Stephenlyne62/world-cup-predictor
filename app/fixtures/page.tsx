"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

function getResult(home: number, away: number) {
  if (home > away) return "home";
  if (away > home) return "away";
  return "draw";
}

function getPredictionStatus(
  match: any,
  prediction?: { home: string; away: string }
) {
  if (
    match.home_score === null ||
    match.away_score === null ||
    !prediction?.home ||
    !prediction?.away
  ) {
    return "pending";
  }

  const predictedHome = Number(prediction.home);
  const predictedAway = Number(prediction.away);

  if (
    predictedHome === match.home_score &&
    predictedAway === match.away_score
  ) {
    return "exact";
  }

  const predictedResult = getResult(predictedHome, predictedAway);
  const actualResult = getResult(match.home_score, match.away_score);

  return predictedResult === actualResult ? "result" : "wrong";
}

export default function FixturesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [scores, setScores] = useState<
    Record<number, { home: string; away: string }>
  >({});

  useEffect(() => {
    async function loadPage() {
      const { data: matchesData, error: matchesError } = await supabase
        .from("matches")
        .select("*")
        .order("kickoff_time", { ascending: true })
        .range(0, 103);

      if (matchesError) {
        alert(matchesError.message);
        return;
      }

      setMatches(matchesData ?? []);

      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) return;

      const { data: predictionsData, error: predictionsError } = await supabase
        .from("predictions")
        .select("match_id, predicted_home_score, predicted_away_score")
        .eq("user_id", userData.user.id);

      if (predictionsError) {
        console.log(predictionsError.message);
        return;
      }

      const savedScores: Record<number, { home: string; away: string }> = {};

      for (const prediction of predictionsData ?? []) {
        savedScores[prediction.match_id] = {
          home: String(prediction.predicted_home_score),
          away: String(prediction.predicted_away_score),
        };
      }

      setScores(savedScores);
    }

    loadPage();
  }, []);

  async function savePrediction(matchId: number) {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      alert("Please log in first.");
      return;
    }

    const prediction = scores[matchId];

    if (!prediction?.home || !prediction?.away) {
      alert("Enter both scores.");
      return;
    }

    const response = await fetch("/api/save-prediction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userData.user.id,
        match_id: matchId,
        home_score: Number(prediction.home),
        away_score: Number(prediction.away),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error);
    } else {
      alert("Prediction saved.");
    }
  }

  return (
    <main className="wc-page">
      <section>
        <div className="wc-hero">
          <p className="wc-kicker">score slips</p>
          <h1 className="wc-title">
            Fixtures<span>.</span>
          </h1>
          <p className="wc-copy">
            Tap in your predictions before kickoff. Clean cards, quick score
            boxes, zero spreadsheet energy.
          </p>
        </div>

        <div className="wc-grid wc-grid-two">
          {matches.map((match) => {
            const locked = new Date() >= new Date(match.kickoff_time);
            const status = getPredictionStatus(match, scores[match.id]);

            return (
              <article
                key={match.id}
                className={`wc-card wc-card-pad fixture-card ${
                  status === "exact"
                    ? "prediction-exact"
                    : status === "result"
                    ? "prediction-result"
                    : status === "wrong"
                    ? "prediction-wrong"
                    : ""
                }`}
              >
                <div className="fixture-topline">
                  <div>
                    <h2 className="fixture-title">
                      {match.home_team} <span>vs</span> {match.away_team}
                    </h2>

                    <p className="fixture-date">
                      {new Date(match.kickoff_time).toLocaleString()}
                    </p>

                    {match.home_score !== null && match.away_score !== null && (
                      <p className="fixture-date">
                        Final score: {match.home_score} - {match.away_score}
                      </p>
                    )}
                  </div>

                  <span
                    className={`wc-pill ${
                      locked ? "wc-pill-locked" : "wc-pill-open"
                    }`}
                  >
                    {locked ? "Locked" : "Open"}
                  </span>
                </div>

                <div className="wc-score-row">
                  <input
                    type="number"
                    disabled={locked}
                    placeholder="Home"
                    className="wc-field"
                    value={scores[match.id]?.home ?? ""}
                    onChange={(e) =>
                      setScores({
                        ...scores,
                        [match.id]: {
                          ...scores[match.id],
                          home: e.target.value,
                        },
                      })
                    }
                  />

                  <input
                    type="number"
                    disabled={locked}
                    placeholder="Away"
                    className="wc-field"
                    value={scores[match.id]?.away ?? ""}
                    onChange={(e) =>
                      setScores({
                        ...scores,
                        [match.id]: {
                          ...scores[match.id],
                          away: e.target.value,
                        },
                      })
                    }
                  />

                  <button
                    disabled={locked}
                    onClick={() => savePrediction(match.id)}
                    className="wc-button"
                  >
                    {locked ? "Locked" : "Save"}
                  </button>
                </div>

                {status === "exact" && (
                  <p className="prediction-status prediction-status-exact">
                    Exact score +3
                  </p>
                )}

                {status === "result" && (
                  <p className="prediction-status prediction-status-result">
                    Correct result +1
                  </p>
                )}

                {status === "wrong" && (
                  <p className="prediction-status prediction-status-wrong">
                    Incorrect prediction
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}