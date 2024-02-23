import axios from 'axios';
import chalk from 'chalk';

const baseUrl = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore';
const cwbKey = process.env.CWB_KEY;
const dataId = 'F-D0047-055';
const webHook = 'https://eoeltjilalhnqum.m.pipedream.net';

if (!cwbKey) {
  console.log(
    chalk.red(
      'Error: You need to supply CWB API key in order to make the requests!'
    )
  );
  process.exit(1);
}

const weatherData = await axios.get(
  `${baseUrl}/${dataId}?Authorization=${cwbKey}`
);

const weatherJson = await weatherData.data;
const report = parseJson(weatherJson);
const predictTime = `${report.startTime} - ${report.endTime.split(' ')[1]}`;
const forecast = `
🪧 天氣預報: ${report.elementValue[0].value}
⏱ 預報時間: ${predictTime}
`;

// Send result to LINE notify
const res = await axios.post(webHook, {
  message: forecast,
});

console.log(res.data);

function parseJson(json) {
  const hsinchuCity = json.records.locations[0].location;
  const { weatherElement } = hsinchuCity.find((l) => l.locationName === '東區');
  const [report] = weatherElement
    .find((el) => el.elementName == 'WeatherDescription')
    .time.slice(0, 1);

  return report;
}
