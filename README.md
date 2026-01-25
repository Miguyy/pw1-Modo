# <img src="Modo/src/images/modoIcon.png" alt="Modo Icon" width="120" height="30"/> - Habit Tracker

A modern, lightweight habit-tracking web app built with Vue and Vite. Modo helps you create, track and visualize habits, and integrates basic weather info for contextual planning.

## What this repo contains

- **Source:** `src/` — Vue components, views, stores and tests.
- **Public:** `public/` — static assets.
- **Mock DB:** `db.json` — lightweight JSON backend for local development.
- **OpenWeather sample:** `openWeather.json` — sample data used by the weather integration.

## Quick demo

- Create/register users, add habits, mark completions, view statistics in charts, gamify with completed tasks.

## Tech used

- Vue 3 + Vite
- Pinia for state management
- Vitest for unit tests
- Plain CSS for styling

### Getting started

Prerequisites

- Node.js 16+ and npm (or yarn)

Install

1. Clone the repo and open the project folder.
2. Install dependencies:

```
npm install
```

Optional front-end libraries

This project uses Bootstrap for layout and utilities, Font Awesome for icons, and Chart.js for charts. Install them with:

```
npm install bootstrap @fortawesome/fontawesome-free chart.js
```

After installing, import them in `src/main.js` (example):

```js
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "chart.js/auto";
```

Run (development)

```
npm run dev
```

Build (production)

```
npm run build
```

Unit tests

Run the test suite with:

```
npm run test:unit
```

3. Open `http://localhost:5173` in your browser.
4. Use the app!

## Project features

- Create and manage user accounts
- Create, edit and delete habits
- Mark habit completions with date tracking
- Dashboard view with habit overview
- Habit statistics charting component
- Simple weather integration (OpenWeather sample)
- Small test suite to validate core behaviors
- Gamification with points for completed habits
- Admin view to manage users and habits
- Responsive design for mobile and desktop
- Avatar decoration for user profiles

## Project structure

- `src/` — application source
- `src/components` — reusable UI components
- `src/views` — page views (Login, Register, Dashboard, Admin)
- `src/stores` — Pinia stores for app state
- `src/api` — API wrappers for local db and weather
- `__tests__/` — unit tests

## Contributors

| Name            | GitHub profile                |
| --------------- | ----------------------------- |
| Miguel Machado  | https://github.com/Miguyy     |
| Manuel Teixeira | https://github.com/Manutex78  |
| Linda Silva     | https://github.com/LindaGlahy |

## Contributions

**Contributing**

- Open an issue or submit a PR. Add tests for new features when possible, if you would like to contribute.

**Notes**

- This repository uses a simple JSON file (`db.json`) for local/demo data. For production use, swap for a proper backend.

**License**

- MIT — feel free to reuse and adapt for learning and classroom projects.
