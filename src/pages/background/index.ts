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
      let chatGPTTabId = (await getStorageValue("chatGPTTabId")) || null;
      console.log("chatGPTTabId", chatGPTTabId);

      const openedChatGPTTabs = await queryTabs({
        url: ["https://chatgpt.com/*", "https://www.chatgpt.com/*"],
      });

      if (
        !chatGPTTabId ||
        openedChatGPTTabs.length === 0 ||
        !openedChatGPTTabs.some((tab) => tab.id === chatGPTTabId)
      ) {
        chatGPTTabId = await openChatGPTTab();
        console.log("await openChatGPTTab()", chatGPTTabId);

        if (chatGPTTabId) {
          await setStorageSync({ chatGPTTabId });
        } else {
          console.error("Unable to open ChatGPT tab.");
          return;
        }
      }

      console.log("free mode", chatGPTTabId);

      try {
        const response = await sendMessagePromise<{
          correctedText: string;
          mistakes: Array<{
            original: string;
            corrected: string;
            explanation: string;
          }>;
        }>(chatGPTTabId, {
          action: "askChatGPT",
          prompt: `correct english, simply friendly style, response in JSON string format: { correctedText: ... ,mistakes: [{original: ...., corrected: ...., explanation: ... } ]}: ${text}`,
        });

        console.log("Response from Content Script:", response);

        // Handle the response as needed
        chrome.tabs.sendMessage(tab.id, {
          action: "improveEnglish",
          data: response,
        });
      } catch (error) {
        console.error("Error communicating with content script:", error);
      }
    }
  }
});

// Function to open a new ChatGPT tab using async/await
const openChatGPTTab = async (): Promise<number | null> => {
  return new Promise((resolve, reject) => {
    chrome.tabs.create({ url: "https://chatgpt.com" }, (newTab) => {
      if (chrome.runtime.lastError || !newTab.id) {
        console.error("Error creating new tab:", chrome.runtime.lastError);
        return reject(chrome.runtime.lastError);
      }

      const tabId = newTab.id;
      console.log(`ChatGPT tab created with ID: ${tabId}`);

      // Listener for tab updates to check when it's fully loaded
      const onUpdateListener = (
        updatedTabId: number,
        changeInfo: chrome.tabs.TabChangeInfo,
        tab: chrome.tabs.Tab
      ) => {
        if (updatedTabId === tabId && changeInfo.status === "complete") {
          console.log("ChatGPT tab fully loaded.");
          chrome.tabs.onUpdated.removeListener(onUpdateListener);
          // Now wait for the content script to signal readiness
        }
      };

      chrome.tabs.onUpdated.addListener(onUpdateListener);

      // Listener for messages from content scripts
      const onMessageListener = (
        message: any,
        sender: chrome.runtime.MessageSender,
        sendResponse: Function
      ) => {
        if (sender.tab?.id === tabId && message === "contentScriptReady") {
          console.log(
            "Received contentScriptReady message from content script."
          );
          chrome.runtime.onMessage.removeListener(onMessageListener);
          resolve(tabId);
        }
      };

      chrome.runtime.onMessage.addListener(onMessageListener);

      // Optional: Implement a timeout to avoid waiting indefinitely
      const timeout = setTimeout(() => {
        console.error(
          "Timeout waiting for content script to send readiness signal."
        );
        chrome.runtime.onMessage.removeListener(onMessageListener);
        reject(new Error("Content script readiness timeout."));
      }, 30000); // 30 seconds timeout

      // Clear the timeout if the promise resolves or rejects
      const originalResolve = resolve;
      resolve = (value) => {
        clearTimeout(timeout);
        originalResolve(value);
      };
      const originalReject = reject;
      reject = (reason) => {
        clearTimeout(timeout);
        originalReject(reason);
      };
    });
  });
};

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

// Wrap chrome.storage.sync.set in a Promise
const setStorageSync = (data: { [key: string]: any }): Promise<void> => {
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
const queryTabs = (
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

const updateChatGPTTabId = async () => {
  try {
    const tabs = await queryTabs({
      url: ["https://chatgpt.com/*", "https://www.chatgpt.com/*"],
    });

    if (tabs.length === 0) {
      await setStorageSync({ chatGPTTabId: null });
    } else {
      await setStorageSync({ chatGPTTabId: tabs[0].id });
    }
  } catch (error) {
    console.error("Error querying tabs:", error);
  }
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    updateChatGPTTabId();
  }
});

// src/utils/sendMessagePromise.ts
export const sendMessagePromise = <T>(
  tabId: number,
  message: any
): Promise<T> => {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(response as T);
      }
    });
  });
};
