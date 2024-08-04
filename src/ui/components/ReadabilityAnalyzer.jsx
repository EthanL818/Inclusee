// src/ui/components/ReadabilityAnalyzer.jsx
import React, { useState } from "react";
import { extractText } from "./ExtractText";
import { recommendChanges } from "./RecommendChanges";
import { applyRecommendations } from "./ApplyRecommendations";

const ReadabilityAnalyzer = ({ sandboxProxy }) => {
  const [analysisResult, setAnalysisResult] = useState(null);

  const analyzeReadability = async () => {
    const textItems = await extractText(sandboxProxy);
    const recommendations = textItems.map((textItem) => {
      const rec = recommendChanges(textItem);
      if (rec) {
        applyRecommendations(textItem, rec);
      }
      return {
        textItem,
        recommendations: rec,
        readable: !rec,
        message: rec ? `Text is not readable. Recommended changes: Font size ${rec.recommendedFontSize}, Font type ${rec.recommendedFontType}` : 'Text is readable.',
      };
    });
    setAnalysisResult(recommendations);
  };

  return (
    <div>
      <button onClick={analyzeReadability}>Analyze Readability</button>
      {analysisResult && (
        <div>
          <h3>Readability Analysis Result:</h3>
          <ul>
            {analysisResult.map((result, index) => (
              <li key={index}>
                <p>{result.textItem.text}</p>
                <p>{result.message}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReadabilityAnalyzer;
