console.log("background script loaded");

import {
  createPromptForOllama,
  generateCodeSuggestionFromOllama,
  getStorageValue,
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
    chrome.tabs.sendMessage(tab.id, {
      action: "openDrawer",
    });

    chrome.tabs.sendMessage(tab.id, {
      action: "selectedText",
      data: selectedText,
    });

    const mode = await getStorageValue("mode");

    if (mode === "ollama") {
      if (!selectedText) return;
      const prompt = createPromptForOllama(selectedText);
      const response = await generateCodeSuggestionFromOllama(prompt);

      if (!response) {
        console.error("No response from AI model");
        return;
      }

      chrome.tabs.sendMessage(tab.id, {
        action: "improveEnglish",
        data: response,
      });
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
