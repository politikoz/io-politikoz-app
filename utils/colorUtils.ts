function hslToHex(h: number, s: number, l: number): string {
  const hDecimal = l / 100;
  const a = (s * Math.min(hDecimal, 1 - hDecimal)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = hDecimal - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function isColorTooSimilar(color1: string, color2: string, threshold = 30): boolean {
  // Convert hex to RGB
  const rgb1 = parseInt(color1.slice(1), 16);
  const r1 = (rgb1 >> 16) & 255;
  const g1 = (rgb1 >> 8) & 255;
  const b1 = rgb1 & 255;

  const rgb2 = parseInt(color2.slice(1), 16);
  const r2 = (rgb2 >> 16) & 255;
  const g2 = (rgb2 >> 8) & 255;
  const b2 = rgb2 & 255;

  // Calculate Euclidean distance
  const distance = Math.sqrt(
    Math.pow(r1 - r2, 2) + 
    Math.pow(g1 - g2, 2) + 
    Math.pow(b1 - b2, 2)
  );

  return distance < threshold;
}

export function generateUniqueColor(existingColors: string[]): string {
  const goldenRatio = 0.618033988749895;
  let hue = Math.random();
  let attempts = 0;
  const maxAttempts = 100;

  do {
    hue += goldenRatio;
    hue %= 1;

    const color = hslToHex(
      Math.floor(hue * 360),
      70,
      55
    );

    // Verifica se a cor é suficientemente diferente de todas as cores existentes
    const isTooSimilar = existingColors.some(existingColor => 
      isColorTooSimilar(color, existingColor)
    );

    if (!isTooSimilar || attempts >= maxAttempts) {
      return color;
    }

    attempts++;
  } while (true);
}

// Cores predefinidas como fallback
export const distinctColors = [
  '#FF4136', // Red
  '#2ECC40', // Green
  '#0074D9', // Blue
  '#FF851B', // Orange
  '#B10DC9', // Purple
  '#FFDC00', // Yellow
  '#7FDBFF', // Light Blue
  '#F012BE', // Magenta
  '#01FF70', // Lime
  '#85144b', // Maroon
  '#39CCCC', // Teal
  '#3D9970'  // Olive
];

// Nova função para validar cores da API
export function validateAndFixColors(apiColors: string[], existingColors: string[] = []): string[] {
  const validatedColors: string[] = [];
  const allExistingColors = [...existingColors];

  for (const color of apiColors) {
    // Verifica se é uma cor válida e não muito similar às existentes
    if (
      color && 
      /^#[0-9A-F]{6}$/i.test(color) && 
      !allExistingColors.some(existing => isColorTooSimilar(color, existing))
    ) {
      validatedColors.push(color);
      allExistingColors.push(color);
    } else {
      // Gera uma nova cor se a cor da API for inválida ou muito similar
      const newColor = generateUniqueColor(allExistingColors);
      validatedColors.push(newColor);
      allExistingColors.push(newColor);
    }
  }

  return validatedColors;
}