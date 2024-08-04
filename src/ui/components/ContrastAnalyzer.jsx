import React, { useState, useCallback } from "react";
import { Button } from "@swc-react/button";
import { Theme } from "@swc-react/theme";
import "./ContrastAnalyzer.css";

const ContrastAnalyzer = ({ sandboxProxy }) => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(true); // State to manage collapse/expand

  async function analyzeContrast() {
    try {
      console.log("Calling analyzeAllPagesContrast");
      const result = await sandboxProxy.analyzeAllPagesContrast();
      console.log("Result from analyzeAllPagesContrast:", result);

      if (!result || typeof result !== "object") {
        throw new Error("Invalid result from analyzeAllPagesContrast");
      }

      if (!Array.isArray(result.contrastAnalysis)) {
        console.error(
          "Unexpected contrastAnalysis structure:",
          result.contrastAnalysis
        );
        throw new Error("contrastAnalysis is not an array");
      }

      setAnalysisResult(result);
      setError(null);
      setIsCollapsed(false); // Ensure the results are shown after analysis
    } catch (error) {
      console.error("Error in analyzeContrast:", error);
      setAnalysisResult(null);
      setError(`Error: ${error.message}`);
    }
  }

  const getFeedbackClass = (feedback) => {
    return feedback === "Pass" ? "feedback-pass" : "feedback-fail";
  };

  const getFeedbackInfo = (feedback) => {
    if (feedback === "Pass") {
      return "Passes WCAG AA standards. The contrast ratio meets or exceeds 4.5:1 for normal text or 3:1 for large text. This ensures readability for most users.";
    } else {
      return "Fails WCAG AA standards. The contrast ratio is below 4.5:1 for normal text or 3:1 for large text. This may cause readability issues for some users, especially those with visual impairments.";
    }
  };

  const copyToClipboard = useCallback((text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setNotification("Color copied!");
        setTimeout(() => setNotification(""), 2000);
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  }, []);

  return (
    <Theme theme="express" scale="medium" color="light">
      <div className="container">
        <Button className="spectrum-Button" size="m" onClick={analyzeContrast}>
          Analyze Contrast
        </Button>
        {analysisResult && (
          <>
            <div className="collapse-header">
              <h3 className="analysis-title">Analysis Results</h3>
              <button
                className="collapse-button"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                {isCollapsed ? "▼" : "▲"}
              </button>
            </div>
            {!isCollapsed && (
              <div className="analysis-result">
                {analysisResult.contrastAnalysis.length > 0 ? (
                  <div>
                    {analysisResult.contrastAnalysis.map((item, index) => (
                      <div key={index} className="color-comparison-row">
                        <div className="contrast-ratio">
                          <strong>Contrast Ratio</strong>{" "}
                          <strong>{item.contrast.toFixed(2)}</strong> : 1{" "}
                          <span
                            className={`feedback-container ${getFeedbackClass(
                              item.feedback
                            )}`}
                          >
                            ({item.feedback})
                            <div className="tooltip">
                              <span className="info-icon">i</span>
                              <span className="tooltiptext">
                                {getFeedbackInfo(item.feedback)}
                              </span>
                            </div>
                          </span>
                        </div>

                        <div className="color-comparison">
                          <div className="color-container">
                            <div
                              className="color-block"
                              style={{ backgroundColor: item.color1 }}
                              onClick={() => copyToClipboard(item.color1)}
                              data-color={item.color1}
                              title="Click to copy"
                            ></div>
                          </div>
                          <div className="color-container">
                            <div
                              className="color-block"
                              style={{ backgroundColor: item.color2 }}
                              onClick={() => copyToClipboard(item.color2)}
                              data-color={item.color2}
                              title="Click to copy"
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No contrast analysis available.</p>
                )}
                <h3>Colors:</h3>
                <ul className="color-list">
                  {analysisResult.colors.map((color, index) => (
                    <li key={index} className="color-item">
                      <div
                        className="color-block"
                        style={{ backgroundColor: color }}
                        onClick={() => copyToClipboard(color)}
                        data-color={color}
                        title="Click to copy"
                      ></div>
                      <span
                        className="color-hex"
                        onClick={() => copyToClipboard(color)}
                        title="Click to copy"
                      >
                        {color}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
        <div className={`notification ${notification ? "show" : ""}`}>
          {notification}
        </div>
      </div>
    </Theme>
  );
};

export default ContrastAnalyzer;
