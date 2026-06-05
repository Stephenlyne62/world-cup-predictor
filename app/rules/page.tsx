export default function RulesPage() {
  return (
    <main className="wc-page">
      <section>
        <div className="wc-hero">
          <p className="wc-kicker">tiny rulebook</p>
          <h1 className="wc-title">Rules<span>.</span></h1>
          <p className="wc-copy">
            Simple scoring, maximum pub-table energy. No spreadsheets required on match day.
          </p>
        </div>

        <div className="rules-grid">
          <article className="wc-card wc-card-pad rule-card">
            <span className="rule-icon">⚽</span>
            <h2>Match Predictions</h2>
            <div className="rule-list">
              <p><strong>Exact score</strong><span>3 points</span></p>
              <p><strong>Correct result</strong><span>1 point</span></p>
              <p><strong>Incorrect prediction</strong><span>0 points</span></p>
            </div>
          </article>

          <article className="wc-card wc-card-pad rule-card rule-card-wide">
            <span className="rule-icon">🏆</span>
            <h2>Bonus Picks</h2>
            <div className="bonus-list">
              <p>Tournament Winner <span>5 pts</span></p>
              <p>Golden Boot Winner <span>5 pts</span></p>
              <p>Player to receive a red card <span>5 pts</span></p>
              <p>Player to score an own goal <span>5 pts</span></p>
              <p>100/1+ Team to go furthest <span>5 pts</span></p>
              <p>Team to win by biggest margin <span>5 pts</span></p>
            </div>
          </article>

          <article className="wc-card wc-card-pad rule-card">
            <span className="rule-icon">⏱️</span>
            <h2>Tiebreaker</h2>
            <p className="rule-copy">
              If players finish level on points, the winner is the player whose prediction is closest to the minute of the first goal scored in the tournament.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
