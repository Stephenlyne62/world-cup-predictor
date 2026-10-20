"use client";

import { useState } from "react";

export default function AdminPage() {
  const [message, setMessage] = useState("");
  const [running, setRunning] = useState("");

  async function runAction(url: string, action: string) {
    setRunning(action);
    setMessage("Running...");

    try {
      const response = await fetch(url);
      const data = await response.json();

      setMessage(JSON.stringify(data, null, 2));
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setRunning("");
    }
  }

  return (
    <main className="wc-page">
      <section className="admin-section">
        <div className="admin-header">
          <p className="wc-kicker">Administration</p>
          <h1>Admin</h1>
          <p>
            Manage tournament fixtures, results and prediction scoring.
          </p>
        </div>

        <div className="admin-actions">
          <button
            type="button"
            onClick={() =>
              runAction("/api/import-fixtures", "fixtures")
            }
            disabled={running !== ""}
          >
            <span className="admin-action-number"></span>

            <span className="admin-action-content">
              <strong>
                {running === "fixtures"
                  ? "Importing..."
                  : "Import fixtures"}
              </strong>

            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              runAction("/api/update-scores", "scores")
            }
            disabled={running !== ""}
          >
            <span className="admin-action-number"></span>

            <span className="admin-action-content">
              <strong>
                {running === "scores"
                  ? "Updating..."
                  : "Update scores"}
              </strong>

            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              runAction("/api/score-predictions", "predictions")
            }
            disabled={running !== ""}
          >
            <span className="admin-action-number"></span>

            <span className="admin-action-content">
              <strong>
                {running === "predictions"
                  ? "Scoring..."
                  : "Score predictions"}
              </strong>

            </span>
          </button>
        </div>

        {message && (
          <div className="admin-output">
            <div className="admin-output-header">
              <span>API response</span>
              {running && <span>Running</span>}
            </div>

            <pre>{message}</pre>
          </div>
        )}
      </section>
    </main>
  );
}