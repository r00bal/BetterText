console.log("background script loaded");

import { getStorageValue } from "./utils";

const generateCodeSuggestionFromOllama = async (prompt: string) => {
  const apiUrl = `http://localhost:11434/api/generate`;
  const body = {
    model: "llama3.1",
    prompt: prompt,
    format: "json",
    stream: false,
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    console.log(response);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const jsonData = await response.json();
    console.log({ jsonData });

    if (!jsonData || Object.keys(jsonData).length === 0) {
      throw new Error("Empty or invalid response from server");
    }
    const responseText = jsonData?.response;
    console.log({ responseText });

    if (!responseText) {
      throw new Error('No valid "response" field in server\'s JSON');
    }
    return responseText;
  } catch (error) {
    console.error("Error:", error);
  }
};

const createPromptSimple = (text: string) => {
  return `You are an English text corrector. Respond in JSON format with two properties: "improved" and "explanation".
  In "improved", correct the English text using a simple, friendly style. Stick as closely as possible to the original text. Only make changes when absolutely necessary, and ensure the result sounds natural and human. Here is the text you should improve: "${text}".`;
};

const createPrompt = (text: string) => {
  return `You are an English text corrector. Respond in JSON format with two properties: "improved" and "explanation".
  In "improved", correct the English text using a simple, friendly style. Stick as closely as possible to the original text. Only make changes when absolutely necessary, and ensure the result sounds natural and human. Here is the text you should improve: "${text}".
  In "explanation", return an array of corrections you made, each with a brief explanation. For each item, provide:
  "original": The mistake in the original text.
  "correction": The corrected version.
  "explanation": A short, friendly explanation of what was wrong and why it was changed.
  Avoid using technical grammar terms. You can mention which rule was broken, but keep explanations simple and essential. Example: [{"original": "example mistake", "correction": "corrected example", "explanation": "Explanation of the correction"}].`;
};

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
    const selection = info.selectionText;
    console.log({ selection });

    chrome.tabs.sendMessage(tab.id, {
      action: "openDrawer",
    });

    chrome.tabs.sendMessage(tab.id, {
      action: "selectedText",
      data: selection,
    });

    const mode = await getStorageValue("mode");
    console.log({ mode });

    if (mode === "ollama") {
      const text = selection;
      if (!text) return;
      const prompt = createPrompt(text);
      const response = await generateCodeSuggestionFromOllama(prompt);

      if (!response) {
        console.error("No response from AI model");
        return;
      }

      const JSONresponse = JSON.parse(response);
      console.log("JSONresponse", JSONresponse);
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
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(`🔑 Property: ${key}`);
    console.log(`   Old value:`, oldValue);
    console.log(`   New value:`, newValue);
  }
});
