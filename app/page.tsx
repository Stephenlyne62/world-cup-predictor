"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const TOURNAMENT_START = "2026-06-11T19:00:00Z";

type Profile = {
  id: string;
  team_name: string;
};

type Prediction = {
  id: number;
  user_id: string;
  predicted_home_score: number;
  predicted_away_score: number;
  points: number;
  matches: {
    home_team: string;
    away_team: string;
    kickoff_time: string;
  };
};

type Outright = {
  user_id: string;
  tournament_winner: string;
  golden_boot: string;
  red_card_player: string;
  own_goal_player: string;
  underdog_team: string;
  biggest_win_team: string;
  points: number;
};

export default function Home() {
  const [tab, setTab] = useState<"leaderboard" | "outrights">("leaderboard");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [outrights, setOutrights] = useState<Outright[]>([]);

  const tournamentStarted = new Date() >= new Date(TOURNAMENT_START);

  useEffect(() => {
    async function loadData() {
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, team_name");

      const { data: predictionsData } = await supabase
        .from("predictions")
        .select(`
          id,
          user_id,
          predicted_home_score,
          predicted_away_score,
          points,
          matches (
            home_team,
            away_team,
            kickoff_time
          )
        `)
        .range(0, 5000);

      const { data: outrightsData } = await supabase
        .from("outright_predictions")
        .select(`
          user_id,
          tournament_winner,
          golden_boot,
          red_card_player,
          own_goal_player,
          underdog_team,
          biggest_win_team,
          points
        `);

      setProfiles(profilesData ?? []);
      setPredictions((predictionsData as any) ?? []);
      setOutrights(outrightsData ?? []);
    }

    loadData();
  }, []);

  function teamName(userId: string) {
    return profiles.find((p) => p.id === userId)?.team_name ?? "Unknown Team";
  }

  const totals: Record<string, number> = {};

  for (const prediction of predictions) {
    totals[prediction.user_id] =
      (totals[prediction.user_id] ?? 0) + (prediction.points ?? 0);
  }

  for (const outright of outrights) {
  totals[outright.user_id] =
    (totals[outright.user_id] ?? 0) + (outright.points ?? 0);
}

  const leaderboard = Object.entries(totals)
    .map(([userId, points]) => ({
      userId,
      teamName: teamName(userId),
      points,
    }))
    .sort((a, b) => b.points - a.points);

  const visiblePredictions = predictions
    .filter(
      (prediction) =>
        new Date(prediction.matches.kickoff_time) <= new Date()
    )
    .sort(
      (a, b) =>
        new Date(b.matches.kickoff_time).getTime() -
        new Date(a.matches.kickoff_time).getTime()
    );

  const predictionsByMatch = visiblePredictions.reduce((groups, prediction) => {
    const key = `${prediction.matches.home_team} vs ${prediction.matches.away_team}`;

    if (!groups[key]) {
      groups[key] = {
        kickoff_time: prediction.matches.kickoff_time,
        predictions: [],
      };
    }

    groups[key].predictions.push(prediction);

    return groups;
  }, {} as Record<string, { kickoff_time: string; predictions: Prediction[] }>);

  const topTeam = leaderboard[0];
  const seventyTwoHoursAgo = Date.now() - 72 * 60 * 60 * 1000;
  const recentTotals: Record<string, number> = {};

  for (const prediction of predictions) {
    const kickoffTime = new Date(prediction.matches.kickoff_time).getTime();

    if (kickoffTime <= Date.now() && kickoffTime >= seventyTwoHoursAgo) {
      recentTotals[prediction.user_id] =
        (recentTotals[prediction.user_id] ?? 0) + (prediction.points ?? 0);
    }
  }

  const recentLeaderboard = Object.entries(recentTotals)
    .map(([userId, points]) => ({
      userId,
      teamName: teamName(userId),
      points,
    }))
    .sort((a, b) => b.points - a.points);

  const recentTopTeam = recentLeaderboard[0];
  const recentBottomTeam = recentLeaderboard.length
    ? recentLeaderboard[recentLeaderboard.length - 1]
    : undefined;

  return (
  <main className="wc-page home-page">
    <section className="wc-hero home-hero">
      <div className="home-hero-copy">
        <p className="wc-kicker">World Cup 2026</p>

        <h1 className="wc-title">
          World Cup <span>Predictor</span>
        </h1>

        <p className="wc-copy">
          Predict every match, make your tournament picks, and compete
          against friends on a live leaderboard.
        </p>

        <div className="home-actions">
          <Link href="/fixtures" className="wc-button">
            Predict fixtures
          </Link>

          <Link href="/outrights" className="wc-button secondary">
            Submit outrights
          </Link>
        </div>
      </div>

      <div className="home-hero-panel wc-card">
        <div className="home-stat-card featured">


          <p className="home-panel-label">Current leader</p>

          <h2>{topTeam ? topTeam.teamName : "No leader yet"}</h2>

          <p>
            {topTeam
              ? `${topTeam.points} points`
              : "The current leader will appear here once scoring begins."}
          </p>
        </div>

        <div className="home-form-grid">
          <div className="home-stat-card compact">
            <span className="stat-icon">↑</span>

            <p className="home-panel-label">Top form · 72h</p>

            <h3>
              {recentTopTeam
                ? recentTopTeam.teamName
                : "No recent scorer"}
            </h3>

            <p>
              {recentTopTeam
                ? `${recentTopTeam.points} points from matches in the last 72 hours.`
                : "Recent form will appear once completed matches begin scoring."}
            </p>
          </div>

          <div className="home-stat-card compact soft">
            <span className="stat-icon">↓</span>

            <p className="home-panel-label">Lowest form · 72h</p>

            <h3>
              {recentBottomTeam
                ? recentBottomTeam.teamName
                : "No recent scorer"}
            </h3>

            <p>
              {recentBottomTeam
                ? `${recentBottomTeam.points} points across the same 72-hour period.`
                : "Form data will appear once completed matches begin scoring."}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section className="home-tabs wc-card wc-card-pad">
      <div className="home-tabs-head">
        <div>
          <p className="wc-kicker">Standings</p>
          <h2>Tournament overview</h2>
        </div>

        <div
          className="tab-switcher"
          aria-label="Home table selector"
        >
          <button
            type="button"
            onClick={() => setTab("leaderboard")}
            className={tab === "leaderboard" ? "active" : ""}
          >
            Leaderboard
          </button>

          <button
            type="button"
            onClick={() => setTab("outrights")}
            className={tab === "outrights" ? "active" : ""}
          >
            Outrights
          </button>
        </div>
      </div>

      {tab === "leaderboard" && (
        <div className="home-list">
          {leaderboard.length === 0 ? (
            <div className="empty-state">
              <p>
                No scores yet. The leaderboard will update once
                tournament scoring begins.
              </p>
            </div>
          ) : (
            leaderboard.map((row, index) => (
              <div
                key={row.userId}
                className="home-rank-row"
              >
                <div className="rank-badge">
                  {index + 1}
                </div>

                <div>
                  <strong>{row.teamName}</strong>
                  <small>Rank {index + 1}</small>
                </div>

                <span className="points-badge">
                  {row.points} pts
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "outrights" && (
        <div className="home-table-wrap">
          <p className="home-table-note">
            Team names are visible now. Bonus picks unlock once
            the tournament starts.
          </p>

          <table className="home-outrights-table">
            <thead>
              <tr>
                <th>Team</th>
                <th>Winner</th>
                <th>Golden Boot</th>
                <th>Red Card</th>
                <th>Own Goal</th>
                <th>100/1+ Team</th>
                <th>Biggest Win</th>
              </tr>
            </thead>

            <tbody>
              {outrights.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    No outright picks submitted yet.
                  </td>
                </tr>
              ) : (
                outrights.map((row) => (
                  <tr key={row.user_id}>
                    <td>
                      <strong>
                        {teamName(row.user_id)}
                      </strong>
                    </td>

                    <td>
                      {tournamentStarted
                        ? row.tournament_winner
                        : "Locked"}
                    </td>

                    <td>
                      {tournamentStarted
                        ? row.golden_boot
                        : "Locked"}
                    </td>

                    <td>
                      {tournamentStarted
                        ? row.red_card_player
                        : "Locked"}
                    </td>

                    <td>
                      {tournamentStarted
                        ? row.own_goal_player
                        : "Locked"}
                    </td>

                    <td>
                      {tournamentStarted
                        ? row.underdog_team
                        : "Locked"}
                    </td>

                    <td>
                      {tournamentStarted
                        ? row.biggest_win_team
                        : "Locked"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>

    <section className="wc-card wc-card-pad home-predictions">
      <div className="home-section-head">
        <div>
          <p className="wc-kicker">Predictions</p>
          <h2>Latest predictions</h2>
        </div>

        <span className="wc-pill wc-pill-locked">
          Visible after kickoff
        </span>
      </div>

      <p className="home-muted">
        Player predictions remain hidden until each match kicks
        off.
      </p>

      <div className="prediction-accordion-list">
        {Object.keys(predictionsByMatch).length === 0 ? (
          <div className="empty-state wide">
            <p>No predictions are visible yet.</p>
          </div>
        ) : (
          Object.entries(predictionsByMatch).map(
            ([matchName, group]) => (
              <details
                key={matchName}
                className="prediction-fixture-card"
              >
                <summary className="prediction-fixture-summary">
                  <div>
                    <h3>{matchName}</h3>

                    <p>
                      {new Date(
                        group.kickoff_time
                      ).toLocaleString()}
                    </p>
                  </div>

                  <span className="wc-pill">
                    {group.predictions.length} picks
                  </span>
                </summary>

                <div className="prediction-fixture-body">
                  {group.predictions.map((prediction) => (
                    <div
                      key={prediction.id}
                      className="prediction-player-card"
                    >
                      <div>
                        <strong>
                          {teamName(prediction.user_id)}
                        </strong>

                        <p>
                          {prediction.matches.home_team}{" "}
                          <span>
                            {
                              prediction.predicted_home_score
                            }
                          </span>
                          {" - "}
                          <span>
                            {
                              prediction.predicted_away_score
                            }
                          </span>{" "}
                          {prediction.matches.away_team}
                        </p>
                      </div>

                      <span className="prediction-points-pill">
                        {prediction.points ?? 0} pts
                      </span>
                    </div>
                  ))}
                </div>
              </details>
            )
          )
        )}
      </div>
    </section>
  </main>
);
}