# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**운수대콩 (Unsu Daekong)** is a web-based Korean Lotto 6/45 number generator with a cute, modern UI. It's a static web application with no build step required.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Browser (index.html)                                       │
│  ├── script.js - Main app logic                             │
│  │   ├── Number generation (Random/Hot/Cold modes)          │
│  │   ├── History management (localStorage)                  │
│  │   └── Theme/animation toggles                            │
│  ├── style.css - CSS Variables, Glassmorphism, Animations   │
│  └── winning_numbers.json - Historical winning data         │
├─────────────────────────────────────────────────────────────┤
│  Node.js Script (fetch_lotto_data.js)                       │
│  └── Fetches data from dhlottery.co.kr API                  │
│      → Updates winning_numbers.json                         │
├─────────────────────────────────────────────────────────────┤
│  GitHub Actions (.github/workflows/update_lotto.yml)        │
│  └── Runs every Sunday (00:00 UTC) to update winning numbers│
└─────────────────────────────────────────────────────────────┘
```

## Key Files

| File | Purpose |
|------|---------|
| `index.html` | Single-page application entry point |
| `script.js` | All client-side logic (DOM, localStorage, number generation algorithms) |
| `style.css` | Dark/Light themes via CSS variables, glassmorphism effects |
| `fetch_lotto_data.js` | Node.js script to fetch historical winning numbers from API |
| `winning_numbers.json` | Array of past winning combinations (index = round - 1) |

## Running Locally

No build process needed. Simply open `index.html` in a browser, or serve with any static server:

```bash
# Option 1: Direct file open
start index.html

# Option 2: Python server
python -m http.server 8000

# Option 3: Node.js serve
npx serve .
```

## Updating Winning Numbers Data

```bash
node fetch_lotto_data.js
```

This fetches the latest winning numbers from `dhlottery.co.kr` API and updates `winning_numbers.json` incrementally.

## Number Generation Modes

1. **Random**: Pure random selection from 1-45
2. **Hot**: Weighted towards numbers appearing most frequently in historical data (top 20)
3. **Cold**: Weighted towards numbers appearing least frequently (bottom 20)

The algorithm also avoids generating combinations that exactly match past winning numbers (up to 100 attempts).

## Data Persistence

- **History**: Stored in `localStorage` as `lottoHistory` array (max 10 items)
- **Theme**: Stored in `localStorage` as `theme` ("dark" | "light")
- **Animation**: Stored in `localStorage` as `useAnimation` ("true" | "false")

## Lotto Number Colors

Numbers are color-coded by range (CSS `data-range` attribute):
- 1-10: Yellow
- 11-20: Blue
- 21-30: Red
- 31-40: Gray
- 41-45: Green

## GitHub Actions Automation

The workflow runs every Sunday at 00:00 UTC (9:00 AM KST) to fetch new winning numbers. It auto-commits to `winning_numbers.json` if there are updates.
