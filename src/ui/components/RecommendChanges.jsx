// src/ui/components/RecommendChanges.jsx
export const recommendChanges = (textItem) => {
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
  