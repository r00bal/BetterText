console.log("background script loaded");
import OpenAI from "openai";

import {
  createPromptForOllama,
  createPromptForOpenAI,
  generateCodeSuggestionFromOllama,
  getStorageValue,
  sendCorrectedText,
} from "./utils";

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension Installed");
  chrome.contextMenus.create({
    id: "improveEnglish",
    title: "Improve my English",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  console.log("contextMenus.onClicked", info, tab);
  if (info.menuItemId === "improveEnglish" && tab?.id) {
    const selectedText = info.selectionText;
    if (!selectedText) return;
    chrome.tabs.sendMessage(tab.id, {
      action: "openDrawer",
    });

    chrome.tabs.sendMessage(tab.id, {
      action: "selectedText",
      data: selectedText,
    });

    const mode = await getStorageValue("mode");

    if (mode === "ollama") {
      const prompt = createPromptForOllama(selectedText);
      const response = await generateCodeSuggestionFromOllama(prompt);

      if (!response) {
        console.error("No response from AI model");
        return;
      }

      sendCorrectedText(tab.id, response);
    }
    if (mode === "api") {
      console.log("MODE: ", mode);
      const { apiKey } = (await chrome.storage.sync.get("apiKey")) || "";
      if (!apiKey || typeof apiKey !== "string") {
        console.error("No API key found");
        return;
      }
      console.log("API KEY: ", apiKey);

      const openai = new OpenAI({ apiKey });
      const prompt = createPromptForOpenAI(selectedText);
      console.log("PROMPT: ", prompt);

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      });

      // Remove the Markdown code block delimiters
      const jsonContent = completion.choices[0].message?.content?.replace(
        /^```json\n|\n```$/g,
        ""
      );
      if (!jsonContent) {
        console.error("No JSON content found");
        return;
      }
      // Parse the JSON content
      const parsedObject = JSON.parse(jsonContent);

      // Convert the parsed object back to a JSON string
      const jsonString = JSON.stringify(parsedObject);

      console.log(jsonString);

      sendCorrectedText(tab.id, jsonString);
    }
  }
});

chrome.storage.onChanged.addListener((changes, area) => {
  console.log("🔄 Storage changes detected:");
  console.log("📂 Area:", area);
  for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(`🔑 Property: ${key}`);
    console.log(`   Old value:`, oldValue);
    console.log(`   New value:`, newValue);
  }
});
