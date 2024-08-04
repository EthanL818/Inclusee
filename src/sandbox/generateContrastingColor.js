// Function to convert a hex color code to an HSL object
function hexToHsl(hex) {
  hex = hex.replace(/^#/, "");
  let r = parseInt(hex.slice(0, 2), 16) / 255;
  let g = parseInt(hex.slice(2, 4), 16) / 255;
  let b = parseInt(hex.slice(4, 6), 16) / 255;

  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s, l: l };
}

// Function to convert an HSL object to a hex color code
function hslToHex(h, s, l) {
  l = l > 1 ? 1 : l < 0 ? 0 : l;
  s = s > 1 ? 1 : s < 0 ? 0 : s;
  h = h % 360;

  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  let m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255)
    .toString(16)
    .padStart(2, "0");
  g = Math.round((g + m) * 255)
    .toString(16)
    .padStart(2, "0");
  b = Math.round((b + m) * 255)
    .toString(16)
    .padStart(2, "0");

  return `#${r}${g}${b}`;
}

// Function to generate contrasting colors in the same hue
function generateContrastingColors(baseColor) {
  const baseHsl = hexToHsl(baseColor);
  const colors = [];

  // Darker shade (reduce lightness)
  colors.push(hslToHex(baseHsl.h, baseHsl.s, Math.max(baseHsl.l - 0.25, 0)));

  // Normal shade (base color)
  colors.push(baseColor);

  // Slightly brighter shade (slightly increase lightness)
  colors.push(hslToHex(baseHsl.h, baseHsl.s, Math.min(baseHsl.l + 0.1, 1)));

  // Lighter shade (moderately increase lightness)
  colors.push(hslToHex(baseHsl.h, baseHsl.s, Math.min(baseHsl.l + 0.18, 1)));

  // Even lighter shade (very light, closer to white)
  colors.push(hslToHex(baseHsl.h, baseHsl.s, Math.min(baseHsl.l + 0.4, 1)));

  return colors;
}

export { generateContrastingColors };
