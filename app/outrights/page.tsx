"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const TOURNAMENT_START = "2026-06-11T19:00:00Z";

const allTeams = [
  ["Mexico", "🇲🇽"], ["South Africa", "🇿🇦"], ["South Korea", "🇰🇷"],
  ["Czechia", "🇨🇿"], ["Canada", "🇨🇦"], ["Bosnia-Herzegovina", "🇧🇦"],
  ["USA", "🇺🇸"], ["Paraguay", "🇵🇾"], ["Qatar", "🇶🇦"],
  ["Switzerland", "🇨🇭"], ["Brazil", "🇧🇷"], ["Morocco", "🇲🇦"],
  ["Argentina", "🇦🇷"], ["Algeria", "🇩🇿"], ["France", "🇫🇷"],
  ["Senegal", "🇸🇳"], ["England", "🏴"], ["Croatia", "🇭🇷"],
  ["Spain", "🇪🇸"], ["Germany", "🇩🇪"], ["Portugal", "🇵🇹"],
  ["Netherlands", "🇳🇱"], ["Belgium", "🇧🇪"], ["Uruguay", "🇺🇾"],
  ["Japan", "🇯🇵"], ["Australia", "🇦🇺"], ["Iran", "🇮🇷"],
  ["Saudi Arabia", "🇸🇦"], ["Ghana", "🇬🇭"], ["Ecuador", "🇪🇨"],
  ["Scotland", "🏴"], ["Egypt", "🇪🇬"], ["Ivory Coast", "🇨🇮"],
  ["Austria", "🇦🇹"], ["Sweden", "🇸🇪"], ["Iraq", "🇮🇶"],
  ["Uzbekistan", "🇺🇿"], ["Cape Verde", "🇨🇻"], ["New Zealand", "🇳🇿"],
  ["Haiti", "🇭🇹"], ["Jordan", "🇯🇴"], ["Curacao", "🇨🇼"],
  ["Panama", "🇵🇦"], ["DR Congo", "🇨🇩"],
];

const underdogTeams = [
  ["Ecuador", "🇪🇨"], ["Senegal", "🇸🇳"], ["Canada", "🇨🇦"],
  ["Sweden", "🇸🇪"], ["Austria", "🇦🇹"], ["Paraguay", "🇵🇾"],
  ["Scotland", "🏴"], ["Egypt", "🇪🇬"], ["Ivory Coast", "🇨🇮"],
  ["Bosnia-Herzegovina", "🇧🇦"], ["Ghana", "🇬🇭"], ["Algeria", "🇩🇿"],
  ["South Korea", "🇰🇷"], ["Australia", "🇦🇺"], ["Iran", "🇮🇷"],
  ["South Africa", "🇿🇦"], ["Saudi Arabia", "🇸🇦"], ["Iraq", "🇮🇶"],
  ["Uzbekistan", "🇺🇿"], ["Cape Verde", "🇨🇻"], ["New Zealand", "🇳🇿"],
  ["Haiti", "🇭🇹"], ["Qatar", "🇶🇦"], ["Jordan", "🇯🇴"],
  ["Curacao", "🇨🇼"], ["Panama", "🇵🇦"], ["DR Congo", "🇨🇩"],
];

function TeamSelect({
  label,
  value,
  onChange,
  teams,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  teams: string[][];
  disabled?: boolean;
}) {
  return (
    <select
      disabled={disabled}
      className="wc-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{label}</option>
      {teams.map(([name, flag]) => (
        <option key={name} value={name}>
          {flag} {name}
        </option>
      ))}
    </select>
  );
}

export default function OutrightsPage() {
  const [teamName, setTeamName] = useState("");
  const [firstGoalMinute, setFirstGoalMinute] = useState("");
  const [tournamentWinner, setTournamentWinner] = useState("");
  const [goldenBoot, setGoldenBoot] = useState("");
  const [redCardPlayer, setRedCardPlayer] = useState("");
  const [ownGoalPlayer, setOwnGoalPlayer] = useState("");
  const [underdogTeam, setUnderdogTeam] = useState("");
  const [biggestWinTeam, setBiggestWinTeam] = useState("");
  const [loading, setLoading] = useState(true);

  const outrightsLocked = new Date() >= new Date(TOURNAMENT_START);

  useEffect(() => {
    async function loadSavedPicks() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("team_name, first_goal_minute")
        .eq("id", data.user.id)
        .single();

      if (profile) {
        setTeamName(profile.team_name ?? "");
        setFirstGoalMinute(
          profile.first_goal_minute ? String(profile.first_goal_minute) : ""
        );
      }

      const { data: outright } = await supabase
        .from("outright_predictions")
        .select("*")
        .eq("user_id", data.user.id)
        .single();

      if (outright) {
        setTournamentWinner(outright.tournament_winner ?? "");
        setGoldenBoot(outright.golden_boot ?? "");
        setRedCardPlayer(outright.red_card_player ?? "");
        setOwnGoalPlayer(outright.own_goal_player ?? "");
        setUnderdogTeam(outright.underdog_team ?? "");
        setBiggestWinTeam(outright.biggest_win_team ?? "");
      }

      setLoading(false);
    }

    loadSavedPicks();
  }, []);

  async function saveOutrights() {
    if (outrightsLocked) {
      alert("Outrights are locked.");
      return;
    }

    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      alert("Please sign in first.");
      return;
    }

    const { error: profileError } = await supabase.from("profiles").upsert({
      id: data.user.id,
      team_name: teamName,
      first_goal_minute: Number(firstGoalMinute),
    });

    if (profileError) {
      alert(profileError.message);
      return;
    }

    const { error } = await supabase.from("outright_predictions").upsert(
      {
        user_id: data.user.id,
        tournament_winner: tournamentWinner,
        golden_boot: goldenBoot,
        red_card_player: redCardPlayer,
        own_goal_player: ownGoalPlayer,
        underdog_team: underdogTeam,
        biggest_win_team: biggestWinTeam,
      },
      { onConflict: "user_id" }
    );

    if (error) alert(error.message);
    else alert("Outrights saved.");
  }

  if (loading) {
    return (
      <main className="wc-page loading-page">
        <div className="wc-card wc-card-pad loading-card">
          Loading your big tournament takes...
        </div>
      </main>
    );
  }

  return (
    <main className="wc-page">
      <section>
        <div className="wc-hero">
          <p className="wc-kicker">
            bonus chaos
          </p>
          <h1 className="wc-title">Outright Predictions<span>.</span></h1>
          <p className="wc-copy">
            Pick your tournament bonuses before the first match kicks off.
          </p>
        </div>

        {outrightsLocked && (
          <div className="lock-banner">
            Outrights are locked because the tournament has started.
          </div>
        )}

        <div className="wc-card wc-card-pad">
          <div className="outrights-grid">
            <input
              disabled={outrightsLocked}
              className="wc-field"
              placeholder="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />

            <input
              disabled={outrightsLocked}
              type="number"
              className="wc-field"
              placeholder="Minute of first tournament goal"
              value={firstGoalMinute}
              onChange={(e) => setFirstGoalMinute(e.target.value)}
            />

            <TeamSelect
              label="Tournament Winner"
              value={tournamentWinner}
              onChange={setTournamentWinner}
              teams={allTeams}
              disabled={outrightsLocked}
            />

            <input
              disabled={outrightsLocked}
              className="wc-field"
              placeholder="Golden Boot Winner"
              value={goldenBoot}
              onChange={(e) => setGoldenBoot(e.target.value)}
            />

            <input
              disabled={outrightsLocked}
              className="wc-field"
              placeholder="Player to receive a red card"
              value={redCardPlayer}
              onChange={(e) => setRedCardPlayer(e.target.value)}
            />

            <input
              disabled={outrightsLocked}
              className="wc-field"
              placeholder="Player to score an own goal"
              value={ownGoalPlayer}
              onChange={(e) => setOwnGoalPlayer(e.target.value)}
            />

            <TeamSelect
              label="100/1+ Team to go furthest"
              value={underdogTeam}
              onChange={setUnderdogTeam}
              teams={underdogTeams}
              disabled={outrightsLocked}
            />

            <TeamSelect
              label="Team to win by the biggest margin"
              value={biggestWinTeam}
              onChange={setBiggestWinTeam}
              teams={allTeams}
              disabled={outrightsLocked}
            />
          </div>

          {!outrightsLocked && (
            <button
              onClick={saveOutrights}
              className="wc-button full-button"
            >
              Save Outrights
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
