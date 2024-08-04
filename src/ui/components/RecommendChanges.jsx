// src/ui/components/RecommendChanges.jsx
import { analyzeReadability } from './AnalyzeReadability';

export const recommendChanges = (textItem) => {
  if (!analyzeReadability(textItem)) {
    return {
      recommendedFontSize: 14,
      recommendedFontType: 'Arial',
    };
  }
  return null;
};
