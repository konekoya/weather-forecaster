# Weather forecaster

A simple app that fetches weather data from [Taiwan Center Weather Bureau](https://www.cwb.gov.tw/V8/C/) and send the weather forecast to a [LINE](https://notify-bot.line.me/en/) chat via [IFFF](https://ifttt.com/explore). The project is currently run on a [scheduled cron](https://github.com/konekoya/weather-forecaster/actions) by GitHub Actions

### Usage

1. Copy and rename the `example.env` to `.env` and then replace the keys inside it with your own.
2. Run the app via `npm`: `npm run start`

Example output:

![Screenshot 2023-03-21 at 4.47.07 pm image](https://i.imgur.com/C9sN3Ci.png)

Note that the forecast location is currently hardcoded in the source ([East district, Hsinchu](https://en.wikipedia.org/wiki/East_District,_Hsinchu)), as this is a very simple app built for my own. I'm not planning to expose any configuration just yet

### Third-party API docs

Possible parameters for CWB restful API:

```js
https://opendata.cwb.gov.tw/api/v1/rest/datastore/{dataid}?locationName={locationName}&elementName={elementName}&sort={sort}&startTime={startTime}&timeFrom={timeFrom}&timeTo={timeTo}
```

for more info about their API, see the [docs](https://opendata.cwb.gov.tw/opendatadoc/CWB_Opendata_API_V1.2.pdf), you can even test the API on [Swagger](https://opendata.cwb.gov.tw/dist/opendata-swagger.html#/%E8%A7%80%E6%B8%AC/get_v1_rest_datastore_O_A0001_001)
