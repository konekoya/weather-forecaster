import axios from 'axios';
import chalk from 'chalk';
import { getWeatherReport } from './services/weather';

const CWB_API_KEY = process.env.CWB_API_KEY;
const LINE_API_KEY = process.env.LINE_NOTIFICATION_API_KEY;
const LINE_USER_ID = process.env.LINE_USER_ID;
const LINE_API_URL = 'https://api.line.me/v2/bot/message/push';

if (!CWB_API_KEY) {
  console.log(
    chalk.red(
      'Error: You need to supply CWB API key in order to make the requests!'
    )
  );
  process.exit(1);
}

try {
  const forecast = await getWeatherReport(CWB_API_KEY);

  // Send result to LINE
  await axios.post(
    LINE_API_URL,
    {
      to: LINE_USER_ID,
      messages: [
        {
          type: 'text',
          text: forecast,
          sender: {
            name: 'Weather Bot',
            iconUrl:
              'https://konekoya.github.io/weather-forecaster/bot-icon.png',
          },
        },
      ],
      notificationDisabled: false,
    },
    {
      headers: {
        Authorization: `Bearer ${LINE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  console.log(chalk.green('✅ Report sent!'));
} catch (error) {
  console.log(chalk.red('😱😱😱 Failed to send weather forecast!'));
  console.log(error);
  process.exit(1);
}
