/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Button } from "@swc-react/button";
import React, { useState } from "react";

const ContrastAnalyzer = ({ sandboxProxy }) => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  async function analyzeContrast() {
    try {
      const result = await sandboxProxy.analyzeCurrentPageContrast();
      setAnalysisResult(result);
      setError(null); // Clear any previous error
    } catch (error) {
      setAnalysisResult(null);
      setError(`Error: ${error.message}`);
    }
  }

  return (
    <div>
      <Button size="m" onClick={analyzeContrast}>
        Analyze Contrast
      </Button>
      {error && (
        <div style={{ marginTop: "20px", color: "red" }}>
          <p>{error}</p>
        </div>
      )}
      {analysisResult && (
        <div style={{ marginTop: "20px" }}>
          <h3>Contrast Analysis</h3>
          {analysisResult.contrastAnalysis ? (
            <>
              <p>
                Lowest Contrast:{" "}
                {analysisResult.contrastAnalysis.lowestContrast.toFixed(2)} (
                {analysisResult.contrastAnalysis.lowestContrastFeedback})
              </p>
              <p>
                Highest Contrast:{" "}
                {analysisResult.contrastAnalysis.highestContrast.toFixed(2)} (
                {analysisResult.contrastAnalysis.highestContrastFeedback})
              </p>
            </>
          ) : (
            <p>No contrast analysis available.</p>
          )}
          <h3>Colors:</h3>
          <ul>
            {analysisResult.colors.map((color, index) => (
              <li key={index} style={{ color: color }}>
                {color}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ContrastAnalyzer;
