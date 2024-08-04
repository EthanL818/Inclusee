// src/ui/components/ApplyRecommendations.jsx
export const applyRecommendations = (textItem, recommendations) => {
    console.log("Applying recommendations to text item:", textItem, recommendations);
    textItem.fontSize = recommendations.recommendedFontSize;
    textItem.fontType = recommendations.recommendedFontType;
  };
  