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

// Function to retrieve all unique colors from all pages
function getColorsFromAllPages() {
  const colorSet = new Set();
  const doc = editor.documentRoot;

  console.log("Total number of pages:", doc.pages.length);

  for (const page of doc.pages) {
    console.log("processing page");

    for (const node of page.allChildren) {
      console.log(node.type);
      getNodeColors(node, colorSet);
    }
  }

  const uniqueColors = Array.from(colorSet);
  console.log("Unique colors found:", uniqueColors);
  return uniqueColors;
}

// Modified function to add colors to a Set instead of an array
function getNodeColors(node, colorSet) {
  if (node.fill && node.fill.type === "Color") {
    const fillColor = node.fill.color;
    if (fillColor) {
      const hexColor = rgbaToHex(fillColor);
      colorSet.add(hexColor);
    }
  }

  if (node.stroke && node.stroke.type === "Color") {
    const strokeColor = node.stroke.color;
    if (strokeColor) {
      const hexColor = rgbaToHex(strokeColor);
      colorSet.add(hexColor);
    }
  }

  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      getNodeColors(child, colorSet);
    }
  }
}

// Function to analyze contrast between all unique colors across all pages
function analyzeAllPagesContrast() {
  console.log("Starting analyzeAllPagesContrast");
  const colors = getColorsFromAllPages();
  console.log("Retrieved unique colors:", colors);

  let contrastAnalysis = [];

  if (colors.length < 2) {
    console.log("Not enough colors found for analysis");
  } else {
    for (let i = 0; i < colors.length - 1; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        const contrast = calculateContrast(colors[i], colors[j]);
        contrastAnalysis.push({
          color1: colors[i],
          color2: colors[j],
          contrast: contrast,
          feedback: contrast >= 4.5 ? "Pass" : "Fail",
        });
      }
    }
  }

  console.log("Contrast analysis results:", contrastAnalysis);

  const result = {
    contrastAnalysis,
    colors,
  };

  console.log("Final result object:", result);
  return result;
}

export { analyzeAllPagesContrast };
