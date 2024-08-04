// src/sandbox/readabilityUtil.js
import { editor } from "express-document-sdk";

// Function to extract text from the document
export const getText = async () => {
  const pages = editor.documentRoot.pages;
  const textItems = [];

  console.log("Pages in document:", pages.length); // Debug logging

  for (const page of pages) {
    console.log("Processing page:", page.name); // Debug logging
    for (const node of page.allChildren) {
      if (node.content && node.content.characters) {
        console.log("Found text node:", node.content.characters); // Debug logging
        textItems.push({
          text: node.content.characters,
          fontSize: node.characterAttributes.size,
          fontType: node.characterAttributes.fontFamily,
          page: page.name,
        });
      }
    }
  }

  console.log("Extracted text items:", textItems); // Debug logging
  return textItems;
};

// Function to recommend changes based on text readability
export const recommendTextChanges = (textItem) => {
  const { fontSize, fontType, text } = textItem;

  // Basic readability criteria (customize as needed)
  const minimumReadableFontSize = 12;
  const preferredFontTypes = ['Arial', 'Verdana', 'Helvetica'];

  let readability = 'Good';
  let recommendations = null;

  // Check font size
  if (fontSize < minimumReadableFontSize) {
    readability = 'Low';
    recommendations = {
      recommendedFontSize: minimumReadableFontSize,
      recommendedFontType: preferredFontTypes.includes(fontType) ? fontType : 'Arial',
    };
  }

  // Check font type
  if (!preferredFontTypes.includes(fontType)) {
    if (readability === 'Good') {
      readability = 'Medium';
    }
    recommendations = {
      recommendedFontSize: recommendations ? recommendations.recommendedFontSize : fontSize,
      recommendedFontType: 'Arial',
    };
  }

  // Check if text is too long for given font size
  if (text.length > 50 && fontSize < 14) {
    readability = 'Low';
    recommendations = {
      recommendedFontSize: 14,
      recommendedFontType: preferredFontTypes.includes(fontType) ? fontType : 'Arial',
    };
  }

  return recommendations ? { readability, ...recommendations } : { readability };
};
