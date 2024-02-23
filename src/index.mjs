import axios from 'axios';
import chalk from 'chalk';

const CWB_API_KEY = process.env.CWB_API_KEY;
const LINE_API_KEY = process.env.LINE_NOTIFICATION_API_KEY;
const BASE_URL = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore';
const DATA_ID = 'F-D0047-055';
const LINE_API_URL = 'https://notify-api.line.me/api/notify';

if (!CWB_API_KEY) {
  console.log(
    chalk.red(
      'Error: You need to supply CWB API key in order to make the requests!'
    )
  );
  process.exit(1);
}

try {
  const weatherData = await axios.get(
    `${BASE_URL}/${DATA_ID}?Authorization=${CWB_API_KEY}`
  );

  const weatherJson = await weatherData.data;
  const { detail, time } = parseJson(weatherJson);
  const forecast = `\n\n🪧 天氣預報: \n${detail}\n\n⏱ 預報時間: ${time}`;

  // Send result to LINE notify
  axios.post(
    LINE_API_URL,
    {
      message: forecast,
    },
    {
      headers: {
        Authorization: `Bearer ${LINE_API_KEY}`,
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  console.log(chalk.green('✅ Successfully sent the report!'));
} catch (error) {
  console.log(chalk.red('😱😱😱 Failed to send weather forecast!'));
  console.log(error);
  process.exit(error?.status ?? 1);
}

function parseJson(json) {
  const hsinchuCity = json.records.locations[0].location;
  const { weatherElement } = hsinchuCity.find((l) => l.locationName === '東區');
  const [report] = weatherElement
    .find((el) => el.elementName == 'WeatherDescription')
    .time.slice(0, 1);

  const detail = report.elementValue[0].value
    .split('。')
    .filter(Boolean)
    .map((v) => `- ${v}`)
    .join('\n');

  return {
    time: `${report.startTime} - ${report.endTime.split(' ')[1]}`,
    detail,
  };
}
