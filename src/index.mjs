import axios from 'axios';
import chalk from 'chalk';
import { format } from 'date-fns';

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

  console.log(chalk.green('✅ Report sent!'));
} catch (error) {
  console.log(chalk.red('😱😱😱 Failed to send weather forecast!'));
  console.log(error);
  process.exit(1);
}

function parseJson(json) {
  const hsinchu = json.records.Locations[0].Location;
  const { WeatherElement } = hsinchu.find((l) => l.LocationName === '東區');
  const [report] = WeatherElement.find(
    (el) => el.ElementName == '天氣預報綜合描述'
  ).Time.slice(0, 1);

  const detail = report.ElementValue[0].WeatherDescription.split('。')
    .filter(Boolean) // Remove empty string
    .map((v) => `- ${v}`) // Format the report so it's easier to read
    .join('\n');

  console.log(report);

  const dateFormat = 'dd MMM yyyy, hh a';
  const start = format(new Date(report.StartTime), dateFormat);
  const end = format(new Date(report.EndTime), dateFormat);

  return { detail, time: `${start} - ${end}` };
}
