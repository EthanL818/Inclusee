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
    getCurrentPage: () => runtime.currentPage // Add a method to get the current page
  };

  console.log("Exposing sandbox API:", sandboxApi); // Debug logging
  runtime.exposeApi(sandboxApi);
}

start();
