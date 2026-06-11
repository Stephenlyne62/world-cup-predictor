"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");

  async function updatePassword() {
    if (!password) {
      alert("Enter a new password.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Password updated successfully.");
      window.location.href = "/login";
    }
  }

  return (
    <main className="wc-page auth-page">
      <section className="auth-layout">
        <div className="wc-hero auth-hero">
          <p className="wc-kicker">account recovery</p>

          <h1 className="wc-title">
            Reset Password<span>.</span>
          </h1>

          <p className="wc-copy">
            Choose a new password for your account.
          </p>
        </div>

        <div className="wc-card wc-card-pad auth-card">
          <div className="wc-form">
            <input
              type="password"
              placeholder="New Password"
              className="wc-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={updatePassword}
              className="wc-button"
            >
              Update Password
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}