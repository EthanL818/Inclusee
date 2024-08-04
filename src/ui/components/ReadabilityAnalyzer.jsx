// src/ui/components/ReadabilityAnalyzer.jsx
import React, { useState } from "react";
import { extractText } from "./ExtractText";
import { recommendChanges } from "./RecommendChanges";
import { applyRecommendations } from "./ApplyRecommendations";

const ReadabilityAnalyzer = ({ sandboxProxy }) => {
  const [analysisResult, setAnalysisResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const analyzeReadability = async () => {
    setLoading(true);
    setAnalysisResult([]); // Clear previous results

    try {
      const textItems = await extractText(sandboxProxy);
      console.log("Extracted Text Items:", textItems); // Debug logging

      const currentPage = await sandboxProxy.getCurrentPage();
      console.log("Current Page:", currentPage); // Debug logging
      const currentPageTextItems = textItems.filter(item => item.page === currentPage); // Analyze current page only
      console.log("Current Page Text Items:", currentPageTextItems); // Debug logging

      if (currentPageTextItems.length === 0) {
        setAnalysisResult([{
          readability: 'No text found on the current page.',
          recommendations: null,
        }]);
        return;
      }

      const analysisResults = currentPageTextItems.map((textItem) => {
        const { readability, recommendedFontSize, recommendedFontType } = recommendChanges(textItem);
        return {
          textItem,
          shortenedText: textItem.text.length > 30 ? `${textItem.text.substring(0, 30)}...` : textItem.text, // Shortened text
          readability,
          message: readability !== 'Good' 
            ? `Recommended changes: Font size ${recommendedFontSize}, Font type ${recommendedFontType}`
            : 'Text is readable.',
          recommendations: readability !== 'Good' 
            ? { recommendedFontSize, recommendedFontType }
            : null,
        };
      });

      console.log("Analysis Results:", analysisResults); // Debug logging
      setAnalysisResult(analysisResults); // Show all results
    } catch (error) {
      console.error("Error during readability analysis:", error);
      setAnalysisResult([{ readability: 'Error', message: 'An error occurred during the analysis.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyRecommendations = async (textItem, recommendations) => {
    applyRecommendations(textItem, recommendations);
    await analyzeReadability(); // Reanalyze after applying recommendations
  };

  return (
    <div className="readability-analyzer">
      <button onClick={analyzeReadability} disabled={loading}>
        {loading ? "Analyzing Readability..." : "Analyze Readability"}
      </button>
      {loading && <div className="loader"></div>}
      {analysisResult.length > 0 && (
        <div>
          <h3>Readability Analysis Result:</h3>
          <ul>
            {analysisResult.map((result, index) => (
              <li key={index} className="analysis-result-item">
                <p><strong>Readability:</strong> {result.readability}</p>
                {result.recommendations && (
                  <div className="recommendations">
                    <p><strong>Recommendations:</strong> {result.message}</p>
                    <button onClick={() => handleApplyRecommendations(result.textItem, result.recommendations)}>Apply Changes</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <button onClick={() => setAnalysisResult([])} className="reanalyze-button">Clear Results</button>
        </div>
      )}
    </div>
  );
};

export default ReadabilityAnalyzer;
