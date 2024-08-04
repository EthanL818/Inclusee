// src/sandbox/code.js
import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { getColors, analyzeCurrentPageContrast } from "./colorUtil.js";
import { getText, recommendTextChanges } from "./readabilityUtil.js";

const { runtime } = addOnSandboxSdk.instance;

async function start() {
  const sandboxApi = {
    getColors: getColors,
    analyzeCurrentPageContrast: analyzeCurrentPageContrast,
    getText: getText,
    recommendTextChanges: recommendTextChanges,
  };

  runtime.exposeApi(sandboxApi);
}

start();
