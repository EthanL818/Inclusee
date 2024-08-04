// src/sandbox/code.js
import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { analyzeAllPagesContrast } from "./colorUtil.js";
import { getText, recommendTextChanges } from "./readabilityUtil.js";

const { runtime } = addOnSandboxSdk.instance;

async function start() {
  const sandboxApi = {
    analyzeAllPagesContrast: analyzeAllPagesContrast,
  };

  console.log("Exposing sandbox API:", sandboxApi); // Debug logging
  runtime.exposeApi(sandboxApi);
}

start();
