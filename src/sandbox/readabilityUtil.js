// src/sandbox/readabilityUtil.js
import { editor } from "express-document-sdk";

// Function to recursively retrieve text from a node and its children
function getNodeText(node, textSet) {
  if (node.text) {
    textSet.add({ text: node.text, fontSize: node.fontSize, fontType: node.fontType });
  }

  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      getNodeText(child, textSet);
    }
  }
}

// Function to retrieve all text from the current document
async function getText() {
  const textSet = new Set();
  const pages = editor.documentRoot.pages;

  for (const page of pages) {
    for (const node of page.allChildren) {
      getNodeText(node, textSet);
    }
  }

  const textItems = Array.from(textSet);
  console.log("Text Items found:", textItems);
  return textItems;
}

// Function to analyze readability of text
function analyzeReadability(textItem) {
  // Example logic to analyze readability
  return textItem.fontSize >= 14; // Assuming 14px is readable
}

// Function to recommend changes for text
function recommendTextChanges(textItem) {
  if (!analyzeReadability(textItem)) {
    return {
      recommendedFontSize: 14,
      recommendedFontType: 'Arial',
    };
  }
  return null;
}

export { getText, recommendTextChanges };
