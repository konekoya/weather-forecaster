import { describe, expect, it } from 'vitest';
import { formatAdvice, getAdvice, parseAdviceValues } from '../services/advice';

const samples: string[] = [
  "晴時多雲。降雨機率20%。溫度攝氏20至22度。舒適。東北風 風速4級(每秒7公尺)。相對濕度84%。",
  "陰時多雲。降雨機率10%。溫度攝氏20至26度。舒適。東北風 風速3級(每秒5公尺)。相對濕度75%。",
  "晴時多雲。降雨機率10%。溫度攝氏20至22度。稍有寒意至舒適。東北風 風速3級(每秒5公尺)。相對濕度82%。",
  "晴時多雲。降雨機率10%。溫度攝氏20至27度。稍有寒意至舒適。偏北風 風速2級(每秒3公尺)。相對濕度75%。",
  "晴時多雲。降雨機率10%。溫度攝氏19至22度。稍有寒意至舒適。東北風 風速2級(每秒3公尺)。相對濕度87%。",
  "晴時多雲。降雨機率20%。溫度攝氏19至25度。稍有寒意至舒適。東南風 風速4級(每秒7公尺)。相對濕度76%。",
  "多雲時陰。降雨機率20%。溫度攝氏19至21度。稍有寒意至舒適。東北風 風速4級(每秒7公尺)。相對濕度79%。",
  "多雲。溫度攝氏17至20度。稍有寒意。東北風 風速5級(每秒8公尺)。相對濕度74%。",
  "多雲時晴。溫度攝氏15至17度。寒冷至稍有寒意。東北風 風速4級(每秒7公尺)。相對濕度70%。",
  "晴時多雲。溫度攝氏15至19度。寒冷至稍有寒意。東北風 風速3級(每秒4公尺)。相對濕度55%。",
  "晴時多雲。溫度攝氏15至16度。寒冷至稍有寒意。東北風 風速2級(每秒3公尺)。相對濕度63%。",
  "晴時多雲。溫度攝氏15至22度。寒冷至舒適。東北風 風速2級(每秒3公尺)。相對濕度58%。",
  "晴時多雲。溫度攝氏16至18度。稍有寒意。東北風 風速2級(每秒2公尺)。相對濕度63%。",
  "晴時多雲。溫度攝氏16至26度。稍有寒意至舒適。東北風 風速2級(每秒2公尺)。相對濕度57%。",
  "晴時多雲。溫度攝氏16至20度。稍有寒意。東南風 風速2級(每秒2公尺)。相對濕度78%。"
];

describe('advice', () => {
  it.each([
    [11, '- 建議穿厚大衣，搭配圍巾和手套'],
    [12, '- 建議穿厚外套'], [15, '- 建議穿厚外套'],
    [16, '- 建議穿長袖，加件外套'], [19, '- 建議穿長袖，加件外套'],
    [20, '- 建議穿長袖，早晚可加件薄外套'], [22, '- 建議穿長袖，早晚可加件薄外套'],
    [23, '- 建議穿短袖或薄長袖'], [27, '- 建議穿短袖或薄長袖'],
  ])('uses the temperature band at %i', (temp, line) => {
    expect(getAdvice({ minTemp: temp, maxTemp: temp })).toEqual(['👕 穿衣建議', line]);
  });

  it('prioritizes heat and includes a large difference', () => {
    expect(getAdvice({ minTemp: 20, maxTemp: 30 })).toEqual([
      '👕 穿衣建議', '- 建議穿短袖，記得補水、防曬', '- 日夜溫差大，記得帶件外套',
    ]);
    expect(getAdvice({ minTemp: 27, maxTemp: 28 })).toContain('- 建議穿短袖，記得補水、防曬');
    expect(getAdvice({ minTemp: 20, maxTemp: 27 })).not.toContain('- 日夜溫差大，記得帶件外套');
    expect(getAdvice({ minTemp: 20, maxTemp: 28 })).toContain('- 日夜溫差大，記得帶件外套');
  });

  it.each([[29, '不用帶傘'], [30, '記得帶傘'], [69, '記得帶傘'], [70, '一定要帶傘'],
    [80, '一定要帶傘']])('handles rain at %i%% without a clothing header', (rain, text) => {
    expect(getAdvice({ rainProbability: rain })).toEqual([`☂️ 降雨機率 ${rain}%，${text}`]);
  });

  it('places all clothing advice before rain', () => {
    expect(getAdvice({ windLevel: 5 })).toEqual([]);
    expect(getAdvice({ minTemp: 20, maxTemp: 22, windLevel: 6, rainProbability: 30 })).toEqual([
      '👕 穿衣建議', '- 建議穿長袖，早晚可加件薄外套',
      '- 風勢較強，建議穿防風衣物', '☂️ 降雨機率 30%，記得帶傘',
    ]);
    expect(getAdvice({ windLevel: 6, rainProbability: 30 })).toEqual([
      '👕 穿衣建議', '- 風勢較強，建議穿防風衣物', '☂️ 降雨機率 30%，記得帶傘',
    ]);
    expect(getAdvice({ rainProbability: 30 })).toEqual(['☂️ 降雨機率 30%，記得帶傘']);
  });

  it('parses ranges, a single value and signed temperatures', () => {
    expect(parseAdviceValues('溫度攝氏-5至3度。降雨機率80%。偏北風 風速6級。')).toEqual({
      minTemp: -5, maxTemp: 3, rainProbability: 80, windLevel: 6,
    });
    expect(parseAdviceValues('溫度攝氏20度')).toEqual({ minTemp: 20, maxTemp: 20 });
  });

  it('ignores missing, malformed and invalid fields independently', () => {
    expect(parseAdviceValues('溫度攝氏22至20度。降雨機率101%。風速6級。')).toEqual({ windLevel: 6 });
    expect(parseAdviceValues('溫度攝氏20至X度。降雨機率-1%。風速X級。')).toEqual({});
    expect(getAdvice({ minTemp: NaN, maxTemp: Infinity, rainProbability: -1, windLevel: NaN }))
      .toEqual([]);
    expect(formatAdvice('')).toBe('');
    expect(formatAdvice(null as unknown as string)).toBe('');
  });

  it('parses all 15 real descriptions and omits absent rain', () => {
    expect(samples).toHaveLength(15);
    samples.forEach((sample, index) => {
      const values = parseAdviceValues(sample);
      expect(values.minTemp).toBeDefined();
      expect(values.maxTemp).toBeDefined();
      expect(values.windLevel).toBeDefined();
      expect(values.rainProbability === undefined).toBe(index >= 7);
      expect(formatAdvice(sample).includes('☂️')).toBe(index < 7);
    });
  });
});
