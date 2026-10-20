# World Cup Predictor

A full-stack prediction platform for the 2026 FIFA World Cup. Users can predict match scores, submit tournament-wide picks, and compete against friends on a live leaderboard.

Built with **Next.js**, **TypeScript**, **Supabase/PostgreSQL**, and deployed on **Vercel**.

---

## Key Features

- Email/password authentication with Supabase Auth
- Predict every World Cup fixture
- Edit predictions until kickoff
- Automatic kickoff locking
- Automatic scoring for completed fixtures
- Live leaderboard
- Tournament-wide outright predictions
- Football-Data.org fixture and result integration
- Admin tools for fixture imports, score updates, and prediction scoring
- Responsive interface

---

## Tech Stack

### Frontend

- Next.js 15
- React
- TypeScript
- CSS

### Backend & Database

- Next.js API routes
- Supabase
- PostgreSQL
- Supabase Auth
- Row Level Security (RLS)

### External API

- Football-Data.org API

### Deployment

- Vercel

---

## Application Overview

### Home

The home page provides an overview of the competition, including the current leader, recent form, tournament standings, outright picks, and the latest available predictions.

<img width="1903" height="842" alt="image" src="https://github.com/user-attachments/assets/74039ca6-70d6-4c06-acaf-2d4f6624742c" />



<img
  src="YOUR-HOME-SCREENSHOT-URL"
  alt="World Cup Predictor home page"
  width="1100"
/>

---

### Fixtures

Users can browse World Cup fixtures, enter score predictions, and update their selections before kickoff.

Predictions are locked automatically when each match begins, preventing changes after the deadline.

<img width="1882" height="1020" alt="image" src="https://github.com/user-attachments/assets/5b3b4c69-66c4-43b3-94d3-0cc11672a46f" />



<img
  src="YOUR-FIXTURES-SCREENSHOT-URL"
  alt="World Cup Predictor fixtures page"
  width="1100"
/>

---

### Outright Predictions

Before the tournament begins, users can submit tournament-wide predictions for:

- Tournament winner
- Golden Boot winner
- Player to receive a red card
- Player to score an own goal
- Best-performing 100/1+ nation
- Team to record the biggest winning margin

Outright selections remain hidden from other players until the tournament begins.

<img width="1900" height="1030" alt="image" src="https://github.com/user-attachments/assets/02357e6c-9b34-475d-8173-1135b89e9c09" />


<img
  src="YOUR-OUTRIGHTS-SCREENSHOT-URL"
  alt="World Cup Predictor outright predictions page"
  width="1100"
/>

---

### Leaderboard

Prediction points are calculated from completed fixtures and combined with any points earned from tournament-wide outright predictions.

The leaderboard provides a live view of each player's overall tournament score and ranking.

<img width="1893" height="1026" alt="image" src="https://github.com/user-attachments/assets/b30928dd-7b9f-4c30-8450-ee8578eba646" />


<img
  src="YOUR-LEADERBOARD-SCREENSHOT-URL"
  alt="World Cup Predictor leaderboard"
  width="1100"
/>

---

### Authentication

Authentication is handled using Supabase Auth.

Users can:

- Create an account
- Sign in securely
- Reset their password
- Access authenticated prediction features

<img width="1603" height="626" alt="image" src="https://github.com/user-attachments/assets/4f704de2-0160-46db-a9c7-4e76ec48a90f" />




<img
  src="YOUR-AUTH-SCREENSHOT-URL"
  alt="World Cup Predictor login page"
  width="1100"
/>

---

## Fixture & Scoring Workflow

Fixture and result data is synced from the Football-Data.org API and stored in PostgreSQL through Supabase.

Predictions can be created or edited before kickoff. Once a match begins, predictions are locked to prevent late changes.

After a fixture is completed:

1. The latest result is synced with the database.
2. Submitted predictions are compared with the final score.
3. Exact-score predictions receive **3 points**.
4. Correct-result predictions receive **1 point**.
5. Incorrect predictions receive **0 points**.
6. Player totals are reflected on the leaderboard.

This keeps fixture data, predictions, scoring, and leaderboard standings connected through a single workflow.

---

## Admin Tools

The application includes an internal admin interface for managing tournament data.

Available actions include:

- Import fixtures
- Update match scores
- Score submitted predictions

These tools trigger the application's API routes and update the underlying tournament data.

---

## Project Structure

```text
app/
├── api/
├── admin/
├── fixtures/
├── login/
├── outrights/
├── profile/
├── reset-password/
├── rules/
└── signup/

components/
lib/
public/
```

---

## Database

The main PostgreSQL tables are:

- `profiles`
- `matches`
- `predictions`
- `outright_predictions`

Supabase is used for database access, authentication, and Row Level Security.

---

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/Stephenlyne62/world-cup-predictor.git
cd world-cup-predictor
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
FOOTBALL_DATA_API_KEY=
```

### 4. Start the development server

```bash
npm run dev
```

The application will then be available locally through the Next.js development server.

---

## Future Improvements

- Scheduled fixture/result syncing and prediction scoring
- Prediction analytics and performance statistics
- Private leagues
- Support for additional tournaments
- Expanded user profiles
- Additional tournament statistics

---

## Author

**Stephen Lyne**

MSc Web Development  
University of Roehampton
