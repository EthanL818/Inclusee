/** @jsx jsx */
import { Theme } from "@swc-react/theme";

import { jsx } from "@emotion/react";
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
