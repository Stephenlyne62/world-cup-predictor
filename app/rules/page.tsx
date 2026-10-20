export default function RulesPage() {
  return (
    <main className="wc-page">
      <section>
        <div className="wc-hero rules-hero">
          <p className="wc-kicker">Competition rules</p>

          <h1 className="wc-title">
            How scoring <span>works.</span>
          </h1>

          <p className="wc-copy">
            Earn points from match predictions and bonus picks.
            The highest total score at the end of the tournament wins.
          </p>
        </div>

        <div className="rules-grid">
          <article className="wc-card wc-card-pad rule-card">
            <span className="rule-number">01</span>

            <h2>Match predictions</h2>

            <p className="rule-description">
              Predict the score of each fixture before kickoff.
            </p>

            <div className="rule-list">
              <p>
                <strong>Exact score</strong>
                <span>3 pts</span>
              </p>

              <p>
                <strong>Correct result</strong>
                <span>1 pt</span>
              </p>

              <p>
                <strong>Incorrect prediction</strong>
                <span>0 pts</span>
              </p>
            </div>
          </article>

          <article className="wc-card wc-card-pad rule-card rule-card-wide">
            <span className="rule-number">02</span>

            <h2>Bonus picks</h2>

            <p className="rule-description">
              Make your tournament-wide predictions before the
              competition begins.
            </p>

            <div className="bonus-list">
              <p>
                Tournament winner
                <span>5 pts</span>
              </p>

              <p>
                Golden Boot winner
                <span>5 pts</span>
              </p>

              <p>
                Player to receive a red card
                <span>5 pts</span>
              </p>

              <p>
                Player to score an own goal
                <span>5 pts</span>
              </p>

              <p>
                100/1+ team to go furthest
                <span>5 pts</span>
              </p>

              <p>
                Team to win by biggest margin
                <span>5 pts</span>
              </p>
            </div>
          </article>

          <article className="wc-card wc-card-pad rule-card">
            <span className="rule-number">03</span>

            <h2>Tiebreaker</h2>

            <p className="rule-description">
              Used only when two or more players finish level on
              points.
            </p>

            <p className="rule-copy">
              The winner is the player whose prediction is closest
              to the minute of the first goal scored in the
              tournament.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}