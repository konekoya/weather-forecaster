import axios from 'axios';
import { format } from 'date-fns';
import { WeatherJson } from '../types';

const WEATHER_API_URL = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore';
// 鄉鎮天氣預報-單一鄉鎮市區預報資料-新竹市未來1週天氣預報
// https://opendata.cwa.gov.tw/dataset/forecast/F-D0047-055
const DATA_ID = 'F-D0047-055';

export async function getWeatherReport(cwbApiKey: string): Promise<string> {
    const weatherData = await axios.get(
        `${WEATHER_API_URL}/${DATA_ID}?Authorization=${cwbApiKey}`
    );

    const weatherJson: WeatherJson = await weatherData.data;
    const { detail, time } = parseJson(weatherJson);
    const forecast = `🪧 天氣預報: \n${detail}\n\n⏱ 預報時間: ${time}`;
    return forecast;
}

function parseJson(json: WeatherJson): { detail: string; time: string } {
    const hsinchu = json.records.Locations[0].Location;

    const { WeatherElement } = hsinchu.find((l) => l.LocationName === '東區')!;
    const [report] = WeatherElement.find(
        (el) => el.ElementName == '天氣預報綜合描述'
    )!.Time.slice(0, 1);

    const detail = report.ElementValue[0].WeatherDescription.split('。')
        .filter(Boolean) // Remove empty string
        .map((v) => `- ${v}`) // Format the report so it's easier to read
        .join('\n');

    const dateFormat = 'dd MMM yyyy, hh a';
    const start = format(new Date(report.StartTime), dateFormat);
    const end = format(new Date(report.EndTime), dateFormat);

    return { detail, time: `${start} - ${end}` };
}
