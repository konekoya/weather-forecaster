# Weather forecaster

A simple app that fetches weather data from [Taiwan Center Weather Bureau](https://www.cwb.gov.tw/V8/C/) and send the weather forecast to a LINE chat

### Usage

1. Copy and rename the `example.env` to `.env` and then replace the keys inside it with your own.
2. Run the app via `npm`: `npm run start`

Example output:

![Screen shot 2022-01-07 at 8.48.46 am image](https://i.imgur.com/v9hm6Tx.png)

Note that the forecast location is currently hardcoded in the source ([North district, Hsinchu](https://en.wikipedia.org/wiki/North_District,_Hsinchu)), as this is a very simple app built for my own. I'm not planning to expose any configuration just yet
:)

### Third-party API docs

Possible parameters for CWB restful API:

```js
https://opendata.cwb.gov.tw/api/v1/rest/datastore/{dataid}?locationName={locationName}&elementName={elementName}&sort={sort}&startTime={startTime}&timeFrom={timeFrom}&timeTo={timeTo}
```

for more info about their API, see the [docs](https://opendata.cwb.gov.tw/opendatadoc/CWB_Opendata_API_V1.2.pdf), you can even test the API on [Swagger](https://opendata.cwb.gov.tw/dist/opendata-swagger.html#/%E8%A7%80%E6%B8%AC/get_v1_rest_datastore_O_A0001_001)
