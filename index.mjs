import chalk from 'chalk';
import fetch from 'node-fetch';

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

  const weatherData = await fetch(
    `${cwb.baseUrl}/${cwb.dataId}?Authorization=${cwb.key}`
  );

  const weatherJson = await weatherData.json();
  const hsinchuCity = weatherJson.records.locations[0].location;
  const { weatherElement } = hsinchuCity.find((l) => l.locationName === '北區');
  const [today] = weatherElement
    .find((el) => el.elementName == 'WeatherDescription')
    .time.slice(0, 1);

  const forecast = `今日天氣預報: ${today.elementValue[0].value}`;

  await fetch(`${ifttt.baseUrl}/${ifttt.key}`, {
    method: 'POST',
    body: JSON.stringify({
      value1: forecast,
    }),
    headers: { 'Content-Type': 'application/json' },
  });
})();
