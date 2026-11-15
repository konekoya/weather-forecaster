export type AdviceValues = {
  minTemp?: number;
  maxTemp?: number;
  rainProbability?: number;
  windLevel?: number;
};

export function parseAdviceValues(description: string): AdviceValues {
  const values: AdviceValues = {};
  const temperature = description.match(/溫度攝氏(-?\d+)(?:至(-?\d+))?度/);
  if (temperature) {
    const min = Number(temperature[1]);
    const max = Number(temperature[2] ?? temperature[1]);
    if (Number.isFinite(min) && Number.isFinite(max) && min <= max) {
      values.minTemp = min;
      values.maxTemp = max;
    }
  }
  const rain = description.match(/降雨機率(\d+)%/);
  if (rain) {
    const probability = Number(rain[1]);
    if (Number.isFinite(probability) && probability <= 100) values.rainProbability = probability;
  }
  const wind = description.match(/風速(\d+)級/);
  if (wind) {
    const level = Number(wind[1]);
    if (Number.isFinite(level)) values.windLevel = level;
  }
  return values;
}

export function getAdvice(values: AdviceValues): string[] {
  const { minTemp, maxTemp, rainProbability, windLevel } = values;
  const min = typeof minTemp === 'number' && Number.isFinite(minTemp) ? minTemp : undefined;
  const max = typeof maxTemp === 'number' && Number.isFinite(maxTemp) ? maxTemp : undefined;
  const validRange = min === undefined || max === undefined || min <= max;
  const clothing: string[] = [];
  if (validRange && max !== undefined && max >= 28) {
    clothing.push('- 建議穿短袖，記得補水、防曬');
  } else if (validRange && min !== undefined) {
    if (min >= 23) clothing.push('- 建議穿短袖或薄長袖');
    else if (min >= 20) clothing.push('- 建議穿長袖，早晚可加件薄外套');
    else if (min >= 16) clothing.push('- 建議穿長袖，加件外套');
    else if (min >= 12) clothing.push('- 建議穿厚外套');
    else clothing.push('- 建議穿厚大衣，搭配圍巾和手套');
  }
  if (validRange && min !== undefined && max !== undefined && max - min >= 8) {
    clothing.push('- 日夜溫差大，記得帶件外套');
  }
  if (typeof windLevel === 'number' && Number.isFinite(windLevel) && windLevel >= 6) {
    clothing.push('- 風勢較強，建議穿防風衣物');
  }
  let rainLine: string | undefined;
  if (typeof rainProbability === 'number' && Number.isFinite(rainProbability)
      && rainProbability >= 0 && rainProbability <= 100) {
    const advice = rainProbability < 30 ? '不用帶傘' : rainProbability < 70 ? '記得帶傘' : '一定要帶傘';
    rainLine = `☂️ 降雨機率 ${rainProbability}%，${advice}`;
  }
  const lines = clothing.length ? ['👕 穿衣建議', ...clothing] : [];
  if (rainLine) lines.push(rainLine);
  return lines;
}

export function formatAdvice(description: string): string {
  try {
    return getAdvice(parseAdviceValues(description)).join('\n');
  } catch {
    return '';
  }
}
