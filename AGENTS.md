# Repository Guidelines

## Project Structure & Module Organization
- `src/` — TypeScript sources. Entry: `src/index.ts`; shared types: `src/types.ts`.
- `docs/` — project assets (e.g., `docs/bot-icon.png`).
- `.github/workflows/` — CI schedule (`schedules.yml`) running the forecast on cron.
- Root: `package.json`, `tsconfig.json`, `.env` (local), `example.env` (template).

## Build, Test, and Development Commands
- `npm install` — install dependencies for local development.
- `npm run start` — run the app via `tsx`, loading variables from `.env`.
- `npm ci` — clean, reproducible install used in CI.
- Optional build: `npx tsc -p tsconfig.json` (not required at runtime; we run via `tsx`).

Example local run: `CWB_API_KEY=... LINE_NOTIFICATION_API_KEY=... LINE_USER_ID=... npm run start`

## Coding Style & Naming Conventions
- TypeScript, strict mode; ES modules.
- Indentation: 2 spaces; lines ≤ 100 chars where practical.
- Strings: single quotes; always use semicolons.
- Filenames: lowercase; multi-word use kebab-case (e.g., `weather-service.ts`).
- Types/Interfaces: PascalCase (e.g., `WeatherJson`); functions/vars: camelCase; constants: UPPER_SNAKE.
- Prefer small, pure functions; keep API interactions in dedicated modules.

## Testing Guidelines
- No test suite yet. If adding tests, prefer Vitest or Jest.
- Place tests under `src/__tests__/` and name `*.test.ts`.
- Aim for coverage on JSON parsing and message formatting.
- Add `"test": "vitest"` (or `jest`) to `package.json` and wire CI as needed.

## Commit & Pull Request Guidelines
- Commits: imperative mood, concise subject; include scope when helpful (e.g., `feat(parser): format report`).
- Link issues in PR descriptions; include context, screenshots of sample output where relevant.
- Keep PRs focused and < ~400 LOC where possible; note env/secrets changes explicitly.

## Security & Configuration Tips
- Local: copy `example.env` to `.env` and set `CWB_API_KEY`, `LINE_NOTIFICATION_API_KEY`, `LINE_USER_ID`.
- CI: provide a complete `.env` via the `ENV_FILE` secret (see `.github/workflows/schedules.yml`).
- Never commit real secrets; add new env keys to `example.env` and README.

## Architecture Overview
- Fetch forecast from CWB Open Data (`F-D0047-055`), parse summary for Hsinchu East District, format text, and push via LINE Messaging API. Scheduling is handled by GitHub Actions.
