"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signUp() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) alert(error.message);
    else alert("Account created. You can now sign in.");
  }

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) alert(error.message);
    else window.location.href = "/";
  }

  async function signOut() {
    await supabase.auth.signOut();
    alert("Signed out.");
  }

  return (
    <main className="wc-page auth-page">
      <section className="auth-layout">
        <div className="wc-hero auth-hero">
          <p className="wc-kicker">clubhouse entry</p>
          <h1 className="wc-title">Login<span>.</span></h1>
          <p className="wc-copy">
            Sign in, name your chaos ball, and keep your tournament takes safely tucked away.
          </p>
        </div>

        <div className="wc-card wc-card-pad auth-card">
          <div className="auth-note">Your picks, your table, your tiny bit of football glory.</div>

          <div className="wc-form">
            <input
              type="email"
              placeholder="Email"
              className="wc-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="wc-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="auth-actions">
              <button onClick={signUp} className="wc-button secondary">Sign Up</button>
              <button onClick={signIn} className="wc-button">Sign In</button>
              <button onClick={signOut} className="wc-button danger">Sign Out</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
