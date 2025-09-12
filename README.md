# Weather Forecaster

[![Scheduled Report](https://github.com/konekoya/weather-forecaster/actions/workflows/schedules.yml/badge.svg)](https://github.com/konekoya/weather-forecaster/actions/workflows/schedules.yml)

A small TypeScript app that fetches weather data from the
[Taiwan Central Weather Bureau](https://www.cwb.gov.tw/V8/C/) and pushes a message to LINE via the
[LINE Messaging API](https://developers.line.biz/en/docs/messaging-api/). It can run locally or on a
fixed schedule using GitHub Actions.

## Quick start

1) Copy `example.env` to `.env` and fill in values.
2) Install deps: `npm install`
3) Run locally: `npm run start`

Example one‑off run with inline envs:

```
CWB_API_KEY=... LINE_NOTIFICATION_API_KEY=... LINE_USER_ID=... npm run start
```

> Note: despite the variable name, `LINE_NOTIFICATION_API_KEY` is a LINE Messaging API
> channel access token (not LINE Notify). See details below.

## Requirements

- Node.js 18+ recommended
- API keys for CWB and LINE Messaging API

## Environment variables

Create a `.env` file with the following keys:

- `CWB_API_KEY` — CWB Open Data API key
- `LINE_NOTIFICATION_API_KEY` — LINE Messaging API channel access token
- `LINE_USER_ID` — recipient user ID to receive the push message

The app uses LINE Messaging API’s push message endpoint and requires a channel access token.
For personal use, set `LINE_USER_ID` to your own LINE user ID.

## CI schedule (GitHub Actions)

This repo includes a workflow at `.github/workflows/schedules.yml` that runs on a schedule
(UTC). To enable it:

1) Create a secret named `ENV_FILE` that contains the full `.env` content.
2) Enable the workflow in your fork/repo. The job will `npm ci` and `npm run start`.

## Project structure

- `src/` — TypeScript sources. Entry: `src/index.ts`; types: `src/types.ts`.
- `docs/` — assets (e.g., `docs/bot-icon.png`).
- `.github/workflows/` — CI schedule (`schedules.yml`).
- Root — `package.json`, `tsconfig.json`, `.env` (local), `example.env` (template).

## Development

- Install: `npm install`
- Run: `npm run start` (uses `tsx` and loads `.env`)
- Optional build: `npx tsc -p tsconfig.json` (runtime uses `tsx`, no build needed)

## Output

The message is pushed to LINE with a formatted summary and time range for the forecast window.

![Forecast Example](https://i.imgur.com/LIxmzXb.png)

> The forecast location is currently hardcoded to
> [Hsinchu City — East District](https://en.wikipedia.org/wiki/East_District,_Hsinchu), as the
> app is built for personal use. Configuration options may be added later.

## Troubleshooting

- Missing `CWB_API_KEY` — the app exits with an error before making requests.
- Invalid `LINE_NOTIFICATION_API_KEY` or `LINE_USER_ID` — the LINE push call fails; check your
  channel access token and recipient ID.
- Timezone — CI schedules are in UTC (converted for Taipei in comments).

## References

- CWB dataset: [F-D0047-055 — Hsinchu City 1‑week forecast](https://opendata.cwa.gov.tw/dataset/forecast/F-D0047-055)
- CWB Swagger: [Open Data Swagger](https://opendata.cwa.gov.tw/dist/opendata-swagger.html?urls.primaryName=openAPI#/%E9%A0%90%E5%A0%B1/get_v1_rest_datastore_F_D0047_055)
- LINE Messaging API: [Docs](https://developers.line.biz/en/docs/messaging-api/)
