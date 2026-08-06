# 🌍 World Cup Predictor

A full-stack web application that allows users to predict every FIFA World Cup match, compete on a live leaderboard, and submit tournament-wide outright predictions.

Built with **Next.js**, **TypeScript**, **Supabase**, and deployed on **Vercel**.

---

## Features

- User authentication (Sign up / Login / Password Reset)
- Predict every World Cup fixture
- Edit predictions until kick-off
- Automatic prediction scoring
- Live leaderboard
- Tournament outright predictions
- Responsive design
- Real-time data from the Football Data API
- Automatic score updates
- Admin tools for tournament management

---

## 🛠️ Tech Stack

### Frontend
- Next.js 15
- React
- TypeScript
- CSS

### Backend & Database
- Supabase
- PostgreSQL
- Row Level Security (RLS)

### API
- Football-Data.org API

### Deployment
- Vercel

---

# Features

## Home

Main landing page displaying:

- Live leaderboard
- Latest predictions (after kick-off)
- Tournament outright picks
- Recent form statistics


## Fixtures

Users can:

- Browse every World Cup fixture
- Enter score predictions
- Edit predictions before kick-off
- View saved predictions


## Outright Predictions

Before the tournament begins, users submit predictions for:

- Tournament Winner
- Golden Boot
- First Red Card
- First Own Goal
- Biggest Winning Team
- Best Performing 100/1+ Nation

These remain hidden until the tournament starts.


## Leaderboard

Prediction points are calculated automatically after each completed fixture.

The leaderboard updates in real-time and also includes outright prediction points.


## Authentication

Authentication is powered by Supabase Auth.

Features include:

- Registration
- Login
- Password reset
- Protected routes


## Automatic Score Updates

The application automatically retrieves match results using the Football Data API.

Once scores are imported:

- Predictions are scored
- Leaderboard updates
- Player rankings change automatically

---

# Project Structure

```
app/
├── api/
├── fixtures/
├── login/
├── outrights/
├── profile/
├── reset-password/
├── signup/

components/

lib/

public/

styles/
```

---

# Database

Main tables

- profiles
- matches
- predictions
- outright_predictions

---

# Installation

Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/world-cup-predictor.git
```

Install dependencies

```bash
npm install
```

Run development server

```bash
npm run dev
```

---

# Environment Variables

Create a `.env.local` file.

```env
NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=

FOOTBALL_DATA_API_KEY=
```

---

# Future Improvements

- Admin dashboard
- Automatic outright scoring
- Prediction statistics
- User profiles
- League support
- Multiple tournaments

---

# Screenshots

## Home

The landing page provides an overview of the competition, including the current leaderboard, recent form, latest predictions, and quick access to fixtures and outright predictions.

<img width="1917" height="922" alt="Home Page" src="https://github.com/user-attachments/assets/ac12ed97-9864-4fa2-ab03-6ddc6314f961" />

<img width="1911" height="1015" alt="Latest Predictions" src="https://github.com/user-attachments/assets/37f25dbb-1b80-49ca-857e-f7ca992da863" />

---

## Fixtures

Users can browse every World Cup fixture, submit score predictions, and edit them until kick-off.

<img width="1910" height="1030" alt="Fixtures Page" src="https://github.com/user-attachments/assets/b74eb384-36fc-440a-a7cd-284118be8b07" />

---

## Outright Predictions

Players submit tournament-wide predictions before the competition begins, including the tournament winner, Golden Boot, first red card, first own goal, biggest winning team, and best-performing underdog.

<img width="1891" height="920" alt="Outright Predictions" src="https://github.com/user-attachments/assets/5486e6e3-0e93-4cb5-83a7-56b4d4879ba7" />

---

## Leaderboard

The live leaderboard automatically updates as matches are scored and includes both fixture prediction points and outright prediction points.

<img width="1912" height="1026" alt="Leaderboard" src="https://github.com/user-attachments/assets/e28a001d-93b4-4112-8cd6-7a1091ba1adb" />

---

## Authentication

Users can securely create an account, sign in, and reset their password using Supabase Authentication.

<img width="1880" height="835" alt="Login Page" src="https://github.com/user-attachments/assets/7ebc7caf-5bf4-4c07-b0e7-79a1b7f00b1b" />

---

# Author

**Stephen Lyne**

MSc Web Development

University of Roehampton
