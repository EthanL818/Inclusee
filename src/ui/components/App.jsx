/** @jsx jsx */
import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";
import { jsx } from "@emotion/react";
import { Theme } from "@swc-react/theme";
import ContrastAnalyzer from "./ContrastAnalyzer";

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
