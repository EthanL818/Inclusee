// src/sandbox/readabilityUtil.js
import { editor } from "express-document-sdk";

// Function to extract text from the document
export async function extractText(sandboxProxy) {
  const document = await sandboxProxy.getDocument();
  const textItems = [];

  document.pages.forEach((page) => {
    page.allChildren.forEach((child) => {
      if (child.type === "Text") {
        textItems.push({
          text: child.content,
          fontSize: child.fontSize,
          fontType: child.fontFamily,
          page: page.index,
        });
      }
    });
  });

  return textItems;
}

// Function to recommend font changes for better readability
export function recommendChanges(textItem) {
  let readability = "Good";
  let recommendedFontSize = textItem.fontSize;
  let recommendedFontType = textItem.fontType;

  // Check if the text is too small
  if (textItem.fontSize < 14) {
    readability = "Poor";
    recommendedFontSize = 14;
  } else if (textItem.fontSize < 16) {
    readability = "Medium";
    recommendedFontSize = 16;
  }

  // Check if the font type is not suitable for dyslexia
  const dyslexiaFriendlyFonts = ["Arial", "Verdana", "Tahoma", "Comic Sans MS"];
  if (!dyslexiaFriendlyFonts.includes(textItem.fontType)) {
    readability = readability === "Good" ? "Medium" : readability;
    recommendedFontType = "Arial";
  }

  return {
    readability,
    recommendedFontSize,
    recommendedFontType,
  };
}

// Function to apply recommended changes
export function applyRecommendations(textItem, recommendations) {
  textItem.fontSize = recommendations.recommendedFontSize;
  textItem.fontFamily = recommendations.recommendedFontType;
}
