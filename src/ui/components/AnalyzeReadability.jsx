// src/ui/components/AnalyzeReadability.jsx
export const analyzeReadability = (textItem) => {
    console.log("Analyzing readability for text:", textItem);
    return textItem.fontSize >= 14; // Assuming 14px is readable
  };
  