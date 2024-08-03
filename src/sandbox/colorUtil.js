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

// Function to recursively retrieve colors from a node and its children
function getNodeColors(node, colorsSet) {
  console.log("Checking node:", node);

  if (node.fill && node.fill.type === "Color") {
    console.log("Node has color fill");
    const fillColor = node.fill.color;
    if (fillColor) {
      const hexColor = rgbaToHex(fillColor);
      console.log("Fill color found:", fillColor);
      console.log("Converted to hex:", hexColor);
      colorsSet.add(hexColor);
    }
  }

  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      getNodeColors(child, colorsSet);
    }
  }
}

// Function to retrieve all colors from the current document
async function getColors() {
  const colorsSet = new Set();
  const pages = editor.documentRoot.pages;

  for (const page of pages) {
    for (const node of page.allChildren) {
      getNodeColors(node, colorsSet);
    }
  }

  const colors = Array.from(colorsSet);
  console.log("Colors found:", colors);
  return colors;
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

async function analyzeCurrentPageContrast() {
  const colors = await getColors();
  if (colors.length < 2) {
    return {
      contrastAnalysis: {
        lowestContrast: 0,
        lowestContrastFeedback: "Insufficient colors for contrast analysis",
        highestContrast: 0,
        highestContrastFeedback: "Insufficient colors for contrast analysis",
      },
      colors: colors,
    };
  }

  let lowestContrast = Infinity;
  let highestContrast = 0;

  for (let i = 0; i < colors.length - 1; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const contrast = calculateContrast(colors[i], colors[j]);
      if (contrast < lowestContrast) {
        lowestContrast = contrast;
      }
      if (contrast > highestContrast) {
        highestContrast = contrast;
      }
    }
  }

  return {
    contrastAnalysis: {
      lowestContrast: lowestContrast || 0,
      lowestContrastFeedback: lowestContrast >= 4.5 ? "Pass" : "Fail",
      highestContrast: highestContrast || 0,
      highestContrastFeedback: highestContrast >= 4.5 ? "Pass" : "Fail",
    },
    colors: colors,
  };
}

export { getColors, analyzeCurrentPageContrast };
