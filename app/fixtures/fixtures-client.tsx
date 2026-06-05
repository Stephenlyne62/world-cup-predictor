"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function FixturesClient({ matches }: { matches: any[] }) {
  const [scores, setScores] = useState<Record<number, { home: string; away: string }>>({});

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

    const { error } = await supabase.from("predictions").upsert(
      {
        user_id: userData.user.id,
        match_id: matchId,
        predicted_home_score: Number(prediction.home),
        predicted_away_score: Number(prediction.away),
      },
      { onConflict: "user_id,match_id" }
    );

    if (error) {
      alert(error.message);
    } else {
      alert("Prediction saved.");
    }
  }

  return (
    <main className="wc-page">
      <section>
        <div className="wc-hero">
          <p className="wc-kicker">score slips</p>
          <h1 className="wc-title">Fixtures<span>.</span></h1>
          <p className="wc-copy">
            Tap in your predictions before kickoff. Clean cards, quick score boxes, zero spreadsheet energy.
          </p>
        </div>

        <div className="wc-grid wc-grid-two">
          {matches.map((match) => {
            const locked = new Date() >= new Date(match.kickoff_time);

            return (
              <article key={match.id} className="wc-card wc-card-pad fixture-card">
                <div className="fixture-topline">
                  <div>
                    <h2 className="fixture-title">
                      {match.home_team} <span>vs</span> {match.away_team}
                    </h2>
                    <p className="fixture-date">{new Date(match.kickoff_time).toLocaleString()}</p>
                  </div>

                  <span className={`wc-pill ${locked ? "wc-pill-locked" : "wc-pill-open"}`}>
                    {locked ? "Locked" : "Open"}
                  </span>
                </div>

                <div className="wc-score-row">
                  <input
                    type="number"
                    disabled={locked}
                    placeholder="Home"
                    className="wc-field"
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
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
