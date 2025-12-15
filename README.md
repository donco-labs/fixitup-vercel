# FixItUp

**FixItUp** is a gamified DIY home improvement tracker designed to encourage homeowners to log their repairs, earn badges, and share their wins (and failures).

It combines the utility of a maintenance scheduler with the dopamine hits of a mobile game.

---

## 🔥 Key Features

### 🎮 Gamification
*   **Points & Levels**: Earn points for every logged project. Level up from "Novice" to "Master Builder".
*   **Badges**: Unlock achievements like "Handy Helper" or "Safety First".
*   **Leaderboard**: Compete against other (simulated) DIYers.
*   **Beratement**: Get lovingly guilt-tripped ("Dad is disappointed") if you ignore your maintenance.

### 📅 Advanced Scheduling (New!)
*   **Smart Intervals**: Schedule tasks "Every 3 Weeks", "Every 2 Years", or annually on specific dates.
*   **Visual Calendar**: View your upcoming chores in a monthly grid.
*   **Whimsical Events**: Automate tasks based on:
    *   🌕 Full Moons (e.g., "Crystal Charging")
    *   👻 Friday the 13th (e.g., "Black Cat Grooming")
    *   🐸 Leap Days

### 🛠️ Project Tracking
*   **AI Analysis**: Simulated AI estimates difficulty and points for your projects.
*   **Multi-Tags**: Categorize jobs (Electrical, Smart Home, Plumbing).
*   **Failures**: Log "Epic Fails" to warn the community (and get pity points).

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

App runs at: [http://localhost:5173](http://localhost:5173)

---

## 📜 Version History

| Version | Date | Codename | Highlights |
|:--- |:--- |:--- |:--- |
| **v0.4.3** | 2025-12-14 | **Stability Patch** | Critical fixes for Project Creation crash, Modal dismissal, and Data Sync issues. |
| **v0.4.2** | 2025-12-14 | **The Magical Calendar Update** | Whimsical Scheduling (Full Moon/Leap Day), Visual Calendar View, Week/Year Intervals. |
| **v0.4.1** | 2025-12-14 | **Pro Scheduling** | Smart Annual Dates, Custom Interval Creation, UI Polish. |
| **v0.4.0** | 2025-12-14 | **The Maintenance Update** | Recurring Task Logic, Negligence Penalties, Changelog History. |
| **v0.3.0** | 2025-12-14 | **Whimsy & AI** | AI Complexity Analysis, "Sweaty" Difficulty, Multi-Tags. |
| **v0.2.0** | 2025-12-14 | **Refactor** | Architecture Split (Components/Views), New Navigation. |
| **v0.1.0** | 2025-12-14 | **Genesis** | Initial Launch. |

---

## 🏗️ Architecture

### Tech Stack
*   **React**: UI Library (Hooks-based).
*   **Vite**: Build tool and dev server.
*   **Lucide React**: Icon system.
*   **Local Storage**: Data persistence (no database required).

### Directory Structure
```
src/
├── components/   # Reusable UI (NavButton, Modals, CalendarGrid)
├── data/         # Static data (Changelog)
├── utils/        # Logic (Storage, Gamification, Scheduling)
├── views/        # Page Components (Home, Leaderboard, Maintenance)
└── App.jsx       # Main Controller
```
