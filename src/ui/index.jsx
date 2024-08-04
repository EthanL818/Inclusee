import "@spectrum-web-components/theme/theme-light.js";
import "@spectrum-web-components/theme/express/theme-light.js";
import "@spectrum-web-components/theme/scale-medium.js";
import "@spectrum-web-components/theme/express/scale-medium.js";

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";

import addOnUISdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";

addOnUISdk.ready.then(async () => {
  console.log("addOnUISdk is ready for use.");

  const { runtime } = addOnUISdk.instance;

  const sandboxProxy = await runtime.apiProxy("documentSandbox");

  const root = createRoot(document.getElementById("root"));
  root.render(<App addOnUISdk={addOnUISdk} sandboxProxy={sandboxProxy} />);
});
