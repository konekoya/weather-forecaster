# Weather Forecaster

[![Scheduled Report](https://github.com/konekoya/weather-forecaster/actions/workflows/schedules.yml/badge.svg)](https://github.com/konekoya/weather-forecaster/actions/workflows/schedules.yml)

A simple app that fetches weather data from the [Taiwan Central Weather Bureau](https://www.cwb.gov.tw/V8/C/) and sends the forecast to a [LINE](https://notify-bot.line.me/en/) chat via the [LINE Notify API](https://notify-bot.line.me/doc/en/). The app is triggered and run on a [scheduled cron job](https://github.com/konekoya/weather-forecaster/actions) using GitHub Actions.

## Usage

1. Copy and rename `example.env` to `.env`, then replace the placeholder values with your API keys. You will need to register for an API key from the [Taiwan Central Weather Bureau](https://www.cwb.gov.tw/V8/C/) and another from the [LINE Notify API](https://notify-bot.line.me/doc/en/).
2. Run the app using npm: `npm run start`
3. Optionally, you can set up a [GitHub Action](https://docs.github.com/en/actions) to trigger the app and send the forecast at specific times automatically.

**Example output:**

![Forecast Example](https://i.imgur.com/LIxmzXb.png)

> **Note:** The forecast location is currently hardcoded in the source code to [East District, Hsinchu](https://en.wikipedia.org/wiki/East_District,_Hsinchu), as this app was built for personal use. Configuration options may be added in the future.

## Third-party API Documentation

For more information about the weather API, see the [official documentation](https://opendata.cwa.gov.tw/dataset/forecast/F-D0047-055). You can also test the API using [Swagger](https://opendata.cwa.gov.tw/dist/opendata-swagger.html?urls.primaryName=openAPI#/%E9%A0%90%E5%A0%B1/get_v1_rest_datastore_F_D0047_055).
