// src/ui/components/App.jsx
import React from "react";
import { Theme } from "@swc-react/theme";
import ContrastAnalyzer from "./ContrastAnalyzer";
import ReadabilityAnalyzer from "./ReadabilityAnalyzer";
import "./App.css"; // Ensure App.css is imported

const App = ({ addOnUISdk, sandboxProxy }) => {
  return (
    <Theme theme="express" scale="medium" color="light">
      <div className="container">
        <div className="contrast-analyzer">
          <ContrastAnalyzer sandboxProxy={sandboxProxy} />
        </div>
        <div className="readability-analyzer">
          <ReadabilityAnalyzer sandboxProxy={sandboxProxy} />
        </div>
      </div>
    </Theme>
  );
};

export default App;
