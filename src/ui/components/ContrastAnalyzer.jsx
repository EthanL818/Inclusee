/** @jsx jsx */
import { Button } from "@swc-react/button";
import { Theme } from "@swc-react/theme";

import { jsx } from "@emotion/react";
import React, { useState } from "react";
import "./App.css";

const ContrastAnalyzer = ({ sandboxProxy }) => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  async function analyzeContrast() {
    try {
      const result = await sandboxProxy.analyzeCurrentPageContrast();
      setAnalysisResult(result);
      setError(null);
    } catch (error) {
      setAnalysisResult(null);
      setError(`Error: ${error.message}`);
    }
  }

  const getFeedbackStyle = (feedback) => {
    return feedback === "Pass" ? { color: "green" } : { color: "red" };
  };

  return (
    <Theme theme="express" scale="medium" color="light">
      <div className="container">
        <Button size="m" onClick={analyzeContrast}>
          Analyze Page Contrast
        </Button>
        {error && (
          <div style={{ marginTop: "20px", color: "red" }}>
            <p>{error}</p>
          </div>
        )}
        {analysisResult && (
          <div style={{ marginTop: "20px" }}>
            <h3>Contrast Analysis</h3>
            {analysisResult.contrastAnalysis.length > 0 ? (
              <div>
                {analysisResult.contrastAnalysis.map((item, index) => (
                  <div key={index}>
                    <p>
                      <strong>Color 1:</strong>{" "}
                      <span style={{ color: item.color1 }}>{item.color1}</span>{" "}
                      <strong>Color 2:</strong>{" "}
                      <span style={{ color: item.color2 }}>{item.color2}</span>{" "}
                      <strong>Contrast Ratio:</strong>{" "}
                      {item.contrast.toFixed(2)}{" "}
                      <span style={getFeedbackStyle(item.feedback)}>
                        ({item.feedback})
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No contrast analysis available.</p>
            )}
            <h3>Colors:</h3>
            <ul style={{ padding: "0", listStyleType: "none" }}>
              {analysisResult.colors.map((color, index) => (
                <li key={index} style={{ color: color, marginBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span
                      style={{
                        display: "inline-block",
                        width: "20px",
                        height: "20px",
                        backgroundColor: color,
                        border: "1px solid #000",
                        marginRight: "10px",
                      }}
                    ></span>
                    {color}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Theme>
  );
};

export default ContrastAnalyzer;
