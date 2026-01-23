# Weather Forecaster

[![Scheduled Report](https://github.com/konekoya/weather-forecaster/actions/workflows/schedules.yml/badge.svg)](https://github.com/konekoya/weather-forecaster/actions/workflows/schedules.yml)

A TypeScript application that fetches weather data from the [Taiwan Central Weather Bureau](https://www.cwb.gov.tw/V8/C/) and interacts with users via LINE.

It supports two modes:
1.  **Scheduled Push**: Automatically sends a weather report every day (powered by GitHub Actions).
2.  **On-demand Reply**: Replies with the latest forecast when a user sends a message (e.g., "天氣") (powered by a Webhook Server).

## Quick start

1.  Copy `example.env` to `.env` and fill in values.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Choose a mode to run:

    *   **Run Webhook Server (for deployment)**:
        ```bash
        npm start
        ```
        Starts the Fastify server using `src/server.ts`.

    *   **Run Cron Job (one-off push)**:
        ```bash
        npm run notify
        ```
        Executes `src/index.ts` to push a single notification.

    *   **Local Development (Watch Mode)**:
        ```bash
        npm run dev
        ```

## Environment variables

Create a `.env` file with the following keys:

- `CWB_API_KEY` — CWB Open Data API key
- `LINE_CHANNEL_ACCESS_TOKEN` — LINE Messaging API channel access token (Long-lived)
- `LINE_CHANNEL_SECRET` — LINE Messaging API channel secret
- `LINE_USER_ID` — (Optional) Recipient user ID for the scheduled push script (`npm run notify`)

> Note: `LINE_CHANNEL_ACCESS_TOKEN` and `LINE_CHANNEL_SECRET` are required for the Webhook Server (`npm start`). `LINE_USER_ID` is required only if you want to use the scheduled push feature.

## Architecture

*   **`src/server.ts`**: Fastify server that listens for LINE Webhooks. Handles user messages and replies.
*   **`src/index.ts`**: Script for the scheduled cron job. Pushes messages proactively.
*   **`src/services/weather.ts`**: Shared logic for fetching and parsing weather data from CWB.

## CI Schedule (GitHub Actions)

This repo includes a workflow at `.github/workflows/schedules.yml` that runs on a schedule. It executes `npm run notify` to push the daily forecast.

## Output

The message is pushed to LINE with a formatted summary and time range for the forecast window.

![Forecast Example](https://i.imgur.com/LIxmzXb.png)

> The forecast location is currently hardcoded to [Hsinchu City — East District](https://en.wikipedia.org/wiki/East_District,_Hsinchu), as the app is built for personal use.

## References

- CWB dataset: [F-D0047-055 — Hsinchu City 1‑week forecast](https://opendata.cwa.gov.tw/dataset/forecast/F-D0047-055)
- LINE Messaging API: [Docs](https://developers.line.biz/en/docs/messaging-api/)
