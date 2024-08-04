/** @jsx jsx */
import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";
import { jsx } from "@emotion/react";
import { Theme } from "@swc-react/theme";

import { jsx } from "@emotion/react";
import ContrastAnalyzer from "./ContrastAnalyzer";
import ReadabilityAnalyzer from "./ReadabilityAnalyzer";
import "./App.css"; // Ensure App.css is imported

const App = ({ addOnUISdk, sandboxProxy }) => {
  return (
    <Theme theme="express" scale="medium" color="light">
      <div>
        <ContrastAnalyzer sandboxProxy={sandboxProxy} />
      </div>
    </Theme>
  );
};

export default App;
