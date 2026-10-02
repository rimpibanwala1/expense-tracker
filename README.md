# SpendWise Expense Tracker

A React + Vite expense tracker with Firebase email/password authentication, local per-user expense storage, charts, search/filtering, dark mode, CSV export, and PDF reports.

## Setup

1. Install Node.js 20+.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open the Vite URL shown in the terminal.

### Firebase

The project currently uses the Firebase project configured in `src/firebase.js`. Enable **Email/Password** sign-in in Firebase Authentication before registering users.

For production, move the Firebase configuration into environment variables rather than committing configuration directly in source.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm run lint` — ESLint checks

## Data behavior

Expenses and income are stored in the browser's local storage under the signed-in Firebase user's UID. This keeps different users' local data separated, but it is not a cloud database. Clearing browser storage removes the local expense data.
