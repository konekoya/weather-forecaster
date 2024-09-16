# Weather forecaster

A simple app that fetches weather data from [Taiwan Center Weather Bureau](https://www.cwb.gov.tw/V8/C/) and sends the weather forecast to a [LINE](https://notify-bot.line.me/en/) chat via [Notify API](https://notify-bot.line.me/doc/en/). And is triggered and run on a [scheduled cron](https://github.com/konekoya/weather-forecaster/actions) by GitHub Actions

### Usage

1. Copy and rename the `example.env` to `.env` and then replace the keys inside it with your own. You will need to register a API key from [Taiwan Center Weather Bureau](https://www.cwb.gov.tw/V8/C/) and an API key from [Notify API](https://notify-bot.line.me/doc/en/)
2. Run the app via `npm`: `npm run start`
3. You can then hook this up with [GitHub action](https://docs.github.com/en/actions) to trigger the run and send the forecast at specific times

Example output:

![Imgur](https://imgur.com/e6aMPRU.png)

Note that the forecast location is currently hardcoded in the source ([East district, Hsinchu](https://en.wikipedia.org/wiki/East_District,_Hsinchu)), as this is a very simple app built for my own. I'm not planning to expose any configuration just yet

### Third-party API docs

For more info about their API, see the [docs](https://opendata.cwa.gov.tw/dataset/forecast/F-D0047-055), you can even test the API on [Swagger](https://opendata.cwa.gov.tw/dist/opendata-swagger.html?urls.primaryName=openAPI#/%E9%A0%90%E5%A0%B1/get_v1_rest_datastore_F_D0047_055)
