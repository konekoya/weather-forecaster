import axios from 'axios';
import chalk from 'chalk';

const cwb = {
  baseUrl: 'https://opendata.cwb.gov.tw/api/v1/rest/datastore',
  key: process.env.CWB_KEY,
  dataId: 'F-D0047-055',
};

const ifttt = {
  baseUrl: 'https://maker.ifttt.com/trigger/line/with/key',
  key: process.env.IFTTT_KEY,
};

(async () => {
  if (!cwb.key || !ifttt.key) {
    console.log(
      chalk.red(
        'Error: You need to supply auth keys in order to make the requests!'
      )
    );
    process.exit(1);
  }

  const weatherData = await axios.get(
    `${cwb.baseUrl}/${cwb.dataId}?Authorization=${cwb.key}`
  );

  const weatherJson = await weatherData.data;
  const report = parseJson(weatherJson);
  const predictTime = `${report.startTime} - ${report.endTime.split(' ')[1]}`;
  const forecast = `🪧 天氣預報: ${report.elementValue[0].value} ⏱ 預報時間: ${predictTime}`;

  // Send result to LINE notify
  await axios.post(`${ifttt.baseUrl}/${ifttt.key}`, {
    value1: forecast,
  });
})();

function parseJson(json) {
  const hsinchuCity = json.records.locations[0].location;
  const { weatherElement } = hsinchuCity.find((l) => l.locationName === '東區');
  const [report] = weatherElement
    .find((el) => el.elementName == 'WeatherDescription')
    .time.slice(0, 1);

  return report;
}
