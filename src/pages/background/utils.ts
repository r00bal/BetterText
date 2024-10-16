import { StorageSync } from "../popup/Popup";
import dummyResponse from "./response.json";

export const fakeData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dummyResponse);
    }, 2000);
  });
};

// Wrap chrome.storage.sync.set in a Promise
export const setStorageSync = (data: { [key: string]: any }): Promise<void> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set(data, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
};

// Wrap chrome.tabs.query in a Promise
export const queryTabs = (
  queryInfo: chrome.tabs.QueryInfo
): Promise<chrome.tabs.Tab[]> => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query(queryInfo, (tabs) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(tabs);
      }
    });
  });
};

export const getStorageValue = async <T extends keyof StorageSync>(
  key: T
): Promise<StorageSync[T]> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(key, (result) => {
      resolve(result[key] as StorageSync[T]);
    });
  });
};

export const generateCodeSuggestionFromOllama = async (
  prompt: string,
  apiUrl = OLLAMA_API_URL
) => {
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
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const jsonData = await response.json();
    if (!jsonData || Object.keys(jsonData).length === 0) {
      throw new Error("Empty or invalid response from server");
    }
    const responseText = jsonData?.response;
    if (!responseText) {
      throw new Error('No valid "response" field in server\'s JSON');
    }
    return responseText;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const createPromptForOpenAI = (text: string) => {
  return `You are an English text corrector. Respond in JSON format with two properties: "improved" and "explanation".
  In "improved", correct the English text using a simple, friendly style. Stick as closely as possible to the original text. Only make changes when absolutely necessary, and ensure the result sounds natural and human. Here is the text you should improve: "${text}".`;
};

export const createPromptForOllama = (text: string) => {
  return `You are an English text corrector. Respond in JSON format with two properties: "improved" and "explanation".
  In "improved", correct the English text using a simple, friendly style. Stick as closely as possible to the original text. Only make changes when absolutely necessary, and ensure the result sounds natural and human. Here is the text you should improve: "${text}".
  In "explanation", return an array of corrections you made, each with a brief explanation. For each item, provide:
  "original": The mistake in the original text.
  "correction": The corrected version.
  "explanation": A short, friendly explanation of what was wrong and why it was changed.
  Avoid using technical grammar terms. You can mention which rule was broken, but keep explanations simple and essential. Example: [{"original": "example mistake", "correction": "corrected example", "explanation": "Explanation of the correction"}].`;
};
