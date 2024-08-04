import { editor } from "express-document-sdk";

// Function to convert a color object to a hex string
function rgbaToHex({ red, green, blue, alpha }) {
  const r = Math.round(red * 255)
    .toString(16)
    .padStart(2, "0");
  const g = Math.round(green * 255)
    .toString(16)
    .padStart(2, "0");
  const b = Math.round(blue * 255)
    .toString(16)
    .padStart(2, "0");
  const a = (alpha !== undefined ? Math.round(alpha * 255) : 255)
    .toString(16)
    .padStart(2, "0");
  return `#${r}${g}${b}${a}`;
}

// Function to recursively retrieve colors and sizes from a node and its children
function getNodeColorsAndSizes(node, data) {
  if (node.fill && node.fill.type === "Color") {
    const fillColor = node.fill.color;
    if (fillColor) {
      const hexColor = rgbaToHex(fillColor);
      const area = node.boundsLocal.width * node.boundsLocal.height;
      data.push({ color: hexColor, area });
    }
  }

  if (node.stroke && node.stroke.type === "Color") {
    const strokeColor = node.stroke.color;
    if (strokeColor) {
      const hexColor = rgbaToHex(strokeColor);
      const area = node.boundsLocal.width * node.boundsLocal.height;
      data.push({ color: hexColor, area });
    }
  }

  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      getNodeColorsAndSizes(child, data);
    }
  }
}

// Function to retrieve all colors and sizes from the current document
async function getColorsAndSizes() {
  const data = [];
  const pages = editor.documentRoot.pages;

  for (const page of pages) {
    for (const node of page.allChildren) {
      getNodeColorsAndSizes(node, data);
    }
  }

  return data;
}

// Function to calculate relative luminance
function getLuminance(rgbHex) {
  const r = parseInt(rgbHex.slice(1, 3), 16) / 255;
  const g = parseInt(rgbHex.slice(3, 5), 16) / 255;
  const b = parseInt(rgbHex.slice(5, 7), 16) / 255;

  const a = [r, g, b].map((v) =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  );

  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

// Function to calculate contrast ratio between two colors
function calculateContrast(color1, color2) {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
}

// Function to analyze contrast between colors on the current page considering node sizes
async function analyzeCurrentPageContrast() {
  const data = await getColorsAndSizes();
  if (data.length < 2) {
    return {
      contrastAnalysis: [],
      colors: [],
    };
  }

  const contrastAnalysis = [];

  for (let i = 0; i < data.length - 1; i++) {
    for (let j = i + 1; j < data.length; j++) {
      const contrast = calculateContrast(data[i].color, data[j].color);
      contrastAnalysis.push({
        color1: data[i].color,
        color2: data[j].color,
        contrast: contrast,
        feedback: contrast >= 4.5 ? "Pass" : "Fail",
      });
    }
  }

  return {
    contrastAnalysis,
    colors: data.map((d) => d.color),
  };
}

export { getColorsAndSizes, analyzeCurrentPageContrast };
