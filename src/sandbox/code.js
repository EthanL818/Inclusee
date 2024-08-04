import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { analyzeAllPagesContrast } from "./colorUtil.js";

const { runtime } = addOnSandboxSdk.instance;

async function start() {
  const sandboxApi = {
    analyzeAllPagesContrast: async () => {
      const result = analyzeAllPagesContrast();
      console.log("Result from analyzeAllPagesContrast:", result);
      return result;
    },
  };

  runtime.exposeApi(sandboxApi);
}

start();
