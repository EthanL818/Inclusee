import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { getColors, analyzeCurrentPageContrast } from "./colorUtil.js";

const { runtime } = addOnSandboxSdk.instance;

async function start() {
  const sandboxApi = {
    getColors: getColors,
    analyzeCurrentPageContrast: analyzeCurrentPageContrast,
  };

  runtime.exposeApi(sandboxApi);
}

start();
