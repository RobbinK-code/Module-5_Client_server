# Aniblog — Frontend (React SPA)

The client for **Aniblog**, an anime cataloguing and review platform. Talks to
the [Flask backend](../Module-5_BackendServer) over JSON. Built with
`create-react-app` — a single `public/index.html`, everything else is React.

## Tech Stack

- **React 18** via `create-react-app`
- **react-router-dom v6** for client-side routing
- **axios** for API calls, with a request interceptor that attaches the JWT
- **Context API** (`AuthContext`) for global auth state — no Redux needed at
  this scale, which keeps the codebase easier to reason about
- Hand-written CSS with a token system (`src/styles/variables.css`) — no UI
  framework, so every screen matches the brief's manga-panel visual identity

## Design system

The visual identity is a "printed manga volume," not a generic streaming
dashboard: ink-bordered panels with an offset halftone shadow, a condensed
display face (Bebas Neue) for headings, and ratings shown as a rotated ink
stamp rather than a star row. Tokens live in `src/styles/variables.css`.

## Routes

| Path | Component | Protected? |
|------|-----------|------------|
| `/` | HomePage | No |
| `/anime/:id` | AnimeDetailPage | No |
| `/login` | LoginPage | No |
| `/register` | RegisterPage | No |
| `/forgot-password` | ForgotPasswordPage | No |
| `/reset-password/:token` | ResetPasswordPage | No |
| `/dashboard` | DashboardPage | **Yes** |
| `/watchlist` | WatchlistPage | **Yes** |
| `/profile` | ProfilePage | **Yes** |
| `/reviews/mine` | MyReviewsPage | **Yes** |
| `/admin/anime/new` | AdminAnimeFormPage | **Yes (admin)** |
| `/admin/anime/:id/edit` | AdminAnimeFormPage | **Yes (admin)** |
| `*` | NotFoundPage | No |

12 routes total, 6 protected — comfortably past the project's minimums of 8
routes / 5 protected. Protection is handled by a single `<ProtectedRoute />`
wrapper component (`src/components/common/ProtectedRoute.jsx`) rather than
repeating auth checks in every page, per the DRY requirement.

## Password Reset Flow

`ForgotPasswordPage` → user enters their email → backend generates a token →
`ResetPasswordPage` (at `/reset-password/:token`) lets them set a new
password. The backend has no email provider wired up yet, so in dev/demo
mode the token is shown directly on screen with a "Go to reset password"
button instead of being emailed — this is called out in the UI and in the
backend's own README so it's not mistaken for the production behavior.

## Local Setup

```bash
# 1. Clone and enter the repo
git clone https://github.com/RobbinK-code/Module-5_Client_server.git
cd Module-5_Client_server

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# .env should point at your local backend, e.g.:
# REACT_APP_API_URL=http://localhost:5000/api

# 4. Run the dev server (make sure the Flask backend is running too)
npm start
# App now running at http://localhost:3000
```

To log in as an admin during local testing, run the backend's `seed.py`
first and use `admin@aniblog.com` / `AdminPass123`.

## Deployment (Vercel)

1. Push this repo to GitHub (already done ✅).
2. In Vercel, **Add New → Project**, import this repo. Vercel auto-detects
   Create React App.
3. Add an environment variable: `REACT_APP_API_URL` = your deployed Render
   backend URL + `/api` (e.g. `https://aniblog-backend.onrender.com/api`).
4. Deploy. `vercel.json` is already set up to rewrite all paths to
   `index.html` so client-side routing (e.g. refreshing on `/watchlist`)
   works correctly.
5. Go back to the backend's Render dashboard and set `FRONTEND_ORIGIN` to
   your new Vercel URL so CORS allows requests from it.

## Project Structure

```
public/index.html        # the app's one and only HTML file
src/
  api/                     # one file per REST resource, axios calls only
  context/
    AuthContext.jsx         # global auth state (user, login, logout, register)
  components/
    layout/                  # Navbar, Footer, Layout wrapper
    common/                   # Loader, Pagination, RatingStamp, ProtectedRoute
    anime/                     # AnimeCard, AnimeGrid
    reviews/                   # ReviewCard, ReviewForm
  pages/                     # one component per route
  styles/                    # design tokens + component/page stylesheets
  App.jsx                   # route table
  index.js                   # entry point
```

## License

MIT — see [LICENSE](./LICENSE).
