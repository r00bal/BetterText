import { StorageSync } from "../popup/Popup";

console.log("background script loaded");
import dummyResponse from "./response.json";

// TODO: getAuthToken is not used yet, need to figure how to implement it
// function getAuthToken(interactive) {
//   chrome.identity.getAuthToken({ interactive: interactive }, function (token) {
//     if (chrome.runtime.lastError) {
//       console.error(chrome.runtime.lastError);
//       return;
//     }
//     console.log("Access Token acquired: " + token);

//     // Use the access token directly
//     fetch("http://localhost:3000/api/openai", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + token,
//       },
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("data", data);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   });
// }

// getAuthToken(true);

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

    chrome.tabs.sendMessage(tab.id, {
      action: "openDrawer",
    });

    chrome.tabs.sendMessage(tab.id, {
      action: "selectedText",
      data: selection,
    });

    const mode = await getStorageValue("mode");

    if (mode === "ollama") {
      const text = selection;
      if (!text) return;
      const prompt = createPrompt(text);
      const response = await generateCodeSuggestionFromOllama(prompt);

      if (!response) {
        console.error("No response from AI model");
        return;
      }
      // const JSONresponse = JSON.parse(response);
      const JSONresponse = response.json();
      console.log("JSONresponse", JSONresponse);
      chrome.tabs.sendMessage(tab.id, {
        action: "improveEnglish",
        data: response,
      });
    }

    if (mode === "free") {
      const text = selection;
      const chatGPTTabId = await getStorageValue("chatGPTTabId");
      console.log("free mode", chatGPTTabId);
      if (!chatGPTTabId) return;

      console.log("free mode", chatGPTTabId);
      // TODO find chatgpt tab and inject there a script that will input the prompt and send to chatgpt. Add also a listener to the chatgpt tab to get the response and send to the content script
      chrome.tabs.sendMessage(chatGPTTabId, {
        action: "askChatGPT",
        prompt: `correct english, simply friendly style, response in JSON string format: { correctedText: ... ,mistakes: [{oryginal: ...., corrected: ...., explenation: ... } ]}: ${text} `,
      });
    }
  }
});

const getStorageValue = async <T extends keyof StorageSync>(
  key: T
): Promise<StorageSync[T]> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(key, (result) => {
      resolve(result[key] as StorageSync[T]);
    });
  });
};

export const fakeData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dummyResponse);
    }, 2000);
  });
};
