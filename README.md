# Weather forecaster

A simple app that fetches weather data from [Taiwan Center Weather Bureau](https://www.cwb.gov.tw/V8/C/) and send the weather forecast to a [LINE](https://notify-bot.line.me/en/) chat via [IFFF](https://ifttt.com/explore). The project is currently run on a [scheduled cron](https://github.com/konekoya/weather-forecaster/actions) by GitHub Actions

### Usage

1. Copy and rename the `example.env` to `.env` and then replace the keys inside it with your own.
2. Run the app via `npm`: `npm run start`

Example output:

![Screenshot 2023-03-21 at 4.47.07 pm image](https://i.imgur.com/C9sN3Ci.png)

Note that the forecast location is currently hardcoded in the source ([East district, Hsinchu](https://en.wikipedia.org/wiki/East_District,_Hsinchu)), as this is a very simple app built for my own. I'm not planning to expose any configuration just yet

### Third-party API docs

for more info about their API, see the [docs](https://opendata.cwa.gov.tw/dataset/forecast/F-D0047-055), you can even test the API on [Swagger](https://opendata.cwa.gov.tw/dist/opendata-swagger.html?urls.primaryName=openAPI#/%E9%A0%90%E5%A0%B1/get_v1_rest_datastore_F_D0047_055)
