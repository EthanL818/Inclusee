// src/sandbox/code.js
import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { analyzeAllPagesContrast } from "./colorUtil.js";
import { getText, recommendTextChanges } from "./readabilityUtil.js";
import { generateContrastingColors } from "./generateContrastingColor"; // Import the new function


const { runtime } = addOnSandboxSdk.instance;

async function start() {
  const sandboxApi = {
    analyzeAllPagesContrast: analyzeAllPagesContrast,
    generateContrastingColors, // Expose the new function
  };

  console.log("Exposing sandbox API:", sandboxApi); // Debug logging
  runtime.exposeApi(sandboxApi);
}

start();
