import { supabase } from "@/lib/supabaseClient";

export default async function LeaderboardPage() {
  const { data: predictions } = await supabase
    .from("predictions")
    .select("user_id, points");

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, team_name");

  const totals: Record<string, number> = {};

  for (const prediction of predictions ?? []) {
    totals[prediction.user_id] =
      (totals[prediction.user_id] ?? 0) +
      (prediction.points ?? 0);
  }

  const leaderboard = Object.entries(totals)
    .map(([userId, points]) => ({
      userId,
      points,
      teamName:
        profiles?.find((p) => p.id === userId)?.team_name ??
        "Unknown Team",
    }))
    .sort((a, b) => b.points - a.points);

  return (
    <main className="wc-page">
      <section>
        <div className="wc-hero">
          <p className="wc-kicker">table toppers</p>
          <h1 className="wc-title">Leaderboard<span>.</span></h1>
          <p className="wc-copy">
            Glory, heartbreak, last-minute limbs. The current mini-league mood board lives here.
          </p>
        </div>

        <div className="wc-card leaderboard-card">
          <div className="leaderboard-header">live-ish standings</div>

          <div className="leaderboard-scroll">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Team</th>
                  <th>Points</th>
                </tr>
              </thead>

              <tbody>
                {leaderboard.map((row, index) => (
                  <tr key={row.userId}>
                    <td>
                      <span className="rank-badge">{index + 1}</span>
                    </td>

                    <td>
                      <strong>{row.teamName}</strong>
                      <small>prediction collective</small>
                    </td>

                    <td>
                      <span className="points-badge">{row.points}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
