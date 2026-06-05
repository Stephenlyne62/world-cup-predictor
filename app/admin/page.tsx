"use client";

import { useState } from "react";

export default function AdminPage() {
  const [message, setMessage] = useState("");

  async function runAction(url: string) {
    setMessage("Running...");

    const response = await fetch(url);
    const data = await response.json();

    setMessage(JSON.stringify(data, null, 2));
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-6">Admin</h1>

      <div className="space-y-4 max-w-md">
        <button
          onClick={() => runAction("/api/import-fixtures")}
          className="w-full bg-blue-600 px-4 py-3 rounded"
        >
          Import Fixtures
        </button>

        <button
          onClick={() => runAction("/api/update-scores")}
          className="w-full bg-green-600 px-4 py-3 rounded"
        >
          Update Scores
        </button>

        <button
          onClick={() => runAction("/api/score-predictions")}
          className="w-full bg-purple-600 px-4 py-3 rounded"
        >
          Score Predictions
        </button>

        {message && (
          <pre className="bg-slate-900 border border-slate-700 p-4 rounded whitespace-pre-wrap">
            {message}
          </pre>
        )}
      </div>
    </main>
  );
}