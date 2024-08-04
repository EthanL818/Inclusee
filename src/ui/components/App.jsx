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
        <ContrastAnalyzer sandboxProxy={sandboxProxy} />
        <ReadabilityAnalyzer sandboxProxy={sandboxProxy} />
      </div>
    </Theme>
  );
};

export default App;
