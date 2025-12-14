# FixItUp

A gamified DIY home improvement tracker designed to encourage homeowners to log their repairs, earn badges, and share their wins (and failuress).

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

App runs at: [http://localhost:5173](http://localhost:5173)

---

## Project Overview

**FixItUp** is a single-file React application (`fixitup.jsx`) that has been wrapped in a modern Vite environment for local development.

### Core Features
*   **Gamification**: Earn Points and Levels. Unlock Badges like "Handy Helper" or "Master Builder".
*   **Project Tracking**: Log tasks with details like Category, Difficulty, and "Failures" (e.g., "Forgot tool").
*   **Community Feed**: Share projects to a local feed.
*   **Leaderboard**: Compare your stats against simulated users.

## Architecture

### Tech Stack
*   **React**: UI Library (Hooks-based).
*   **Vite**: Build tool and dev server.
*   **Lucide React**: Icon system.

### Control Flow
The app relies on a central `FixItUpApp` component that manages state via React Hooks:
1.  **Initialization**: On mount, it loads user profile, projects, and feed data from storage. If no user exists, it creates a random one.
2.  **Navigation**: Users switch between `Home` (Stats/Projects), `Rankings` (Leaderboard), and `Community` (Feed) views.
3.  **Data Persistence**: All state changes (adding a project, liking a post) trigger an immediate write to `window.storage`.

### Storage Mock
The original component relies on a custom `window.storage` API. To make this run in a standard browser, we polyfilled this in `main.jsx`:
*   **Intercept**: Calls to `window.storage` are intercepted.
*   **Persist**: Data is saved to the browser's native `localStorage`.
*   **Result**: Your profile, badges, and projects persist across page reloads.

## Development

### How Vite Works Here
Vite acts as the bridge between the raw `fixitup.jsx` component and the browser:
1.  **Transpilation**: Converts JSX to standard JavaScript on the fly.
2.  **Resolution**: Resolves imports like `lucide-react` from `node_modules`.
3.  **HMR**: Instantly updates the browser without a full reload when you save changes.

### Execution Path
When you run `npm run dev`:
1.  **NPM** triggers the `vite` binary.
2.  **Vite** starts a local server and pre-bundles dependencies.
3.  **Browser** requests `index.html`, which requests `main.jsx`.
4.  **Vite** compiles `main.jsx` and `fixitup.jsx` into valid JS modules.
5.  **Browser** executes the code, initializes the storage mock, and mounts the React app.
