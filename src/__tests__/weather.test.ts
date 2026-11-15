import axios from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as advice from '../services/advice';
import { getWeatherReport } from '../services/weather';

vi.mock('axios', () => ({ default: { get: vi.fn() } }));

function forecast(description: string, start: string, end: string) {
  vi.mocked(axios.get).mockResolvedValue({ data: { records: { Locations: [{ Location: [{
    LocationName: '東區', WeatherElement: [{ ElementName: '天氣預報綜合描述', Time: [{
      StartTime: start, EndTime: end, ElementValue: [{ WeatherDescription: description }],
    }] }],
  }] }] } } });
}

afterEach(() => vi.restoreAllMocks());

describe('weather report', () => {
  it.each([
    ['晴時多雲。降雨機率20%。溫度攝氏20至22度。舒適。東北風 風速4級(每秒7公尺)。相對濕度84%。',
      '2026-11-15T18:00:00', '2026-11-16T06:00:00', '15 Nov 2026, 06 PM - 16 Nov 2026, 06 AM', 20],
    ['陰時多雲。降雨機率10%。溫度攝氏20至26度。舒適。東北風 風速3級(每秒5公尺)。相對濕度75%。',
      '2026-11-16T06:00:00', '2026-11-16T18:00:00', '16 Nov 2026, 06 AM - 16 Nov 2026, 06 PM', 10],
  ])('adds advice to the complete report', async (description, start, end, time, rain) => {
    forecast(description, start, end);
    const bullets = description.split('。').filter(Boolean).map((part) => `- ${part}`).join('\n');
    expect(await getWeatherReport('fixture')).toBe(
      `🪧 天氣預報: \n${bullets}\n\n👕 穿衣建議\n- 建議穿長袖，早晚可加件薄外套\n` +
      `☂️ 降雨機率 ${rain}%，不用帶傘\n\n⏱ 預報時間: ${time}`,
    );
  });

  it('keeps the forecast when advice unexpectedly throws', async () => {
    forecast('晴時多雲。', '2026-11-15T18:00:00', '2026-11-16T06:00:00');
    vi.spyOn(advice, 'formatAdvice').mockImplementation(() => { throw new Error('failure'); });
    expect(await getWeatherReport('fixture')).toBe(
      '🪧 天氣預報: \n- 晴時多雲\n\n⏱ 預報時間: 15 Nov 2026, 06 PM - 16 Nov 2026, 06 AM',
    );
  });

  it('places rain-only advice without a clothing header', async () => {
    forecast(' 陰。降雨機率30%。', '2026-11-15T18:00:00', '2026-11-16T06:00:00');
    expect(await getWeatherReport('fixture')).toContain(
      '-  陰\n- 降雨機率30%\n\n☂️ 降雨機率 30%，記得帶傘\n\n⏱ 預報時間:',
    );
  });
});
