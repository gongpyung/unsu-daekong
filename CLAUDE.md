# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server**: `npm run dev` (port 8080)
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Test**: `npm run test` (single run), `npm run test:watch` (watch mode)
- **Fetch lotto data**: `npm run fetch-data` (updates `src/data/winning_numbers.json`)

## Tech Stack

React 18 + TypeScript + Vite (SWC) + Tailwind CSS + shadcn/ui (Radix). Single-page app with React Router.

## Architecture

Korean lotto number generator ("운수대콩"). Core flow:

1. **`src/lib/lotto.ts`** — Number generation engine. `calculateFrequencies()` analyzes `winning_numbers.json` for hot/cold modes. `generateNumbers(mode, include, exclude)` returns 6 sorted numbers with duplicate-check against historical winning sets.
2. **`src/pages/Index.tsx`** — Main page. Orchestrates generation, rolling animation (50ms interval with staggered stops via `useRef` + direct DOM manipulation), and history management.
3. **`src/data/winning_numbers.json`** — Historical Korean lotto data (~1214 draws). Updated via `scripts/fetch-lotto-data.js`.

## Key Patterns

- **Rolling animation**: Uses `ballRefs` (useRef array) + `setInterval`/`setTimeout` for DOM-level text cycling, not React state. `LottoBall` uses `forwardRef` to expose its DOM element.
- **Cross-component events**: `AnimationToggle` dispatches `CustomEvent("animationToggle")` listened by `Index.tsx`.
- **localStorage keys**: `lotto-history` (HistoryEntry[]), `useAnimation` (boolean string), `theme` ("dark"/"light").
- **Ball colors**: Determined by number range — 1-10 pink, 11-20 yellow, 21-30 green, 31-40 blue, 41-45 purple (`getBallColor` in `LottoBall.tsx`).

## Styling

- Custom fonts: `Jua` (font-title) for headings, `Gaegu` (font-body) for body text.
- Custom animations defined in `tailwind.config.ts`: bounce, wiggle, pop-in, float, sparkle, slide-up, fade-out-down.
- Dark mode via class strategy (`next-themes`).

## TypeScript Config

Loose settings: `strict: false`, `noImplicitAny: false`. Path alias `@` → `./src`.
