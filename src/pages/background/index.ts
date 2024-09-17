console.log("background script loaded");

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "improveEnglish",
    title: "Improve my English",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log("contextMenus.onClicked", info, tab);
  if (info.menuItemId === "improveEnglish" && tab?.id) {
    chrome.tabs.sendMessage(tab.id, {
      action: "improveEnglish",
      text: info.selectionText,
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "improveEnglish") {
    chrome.storage.sync.get("aiModel", (data) => {
      const aiModel = data.aiModel || "ollama";
      // TODO: Implement API call to Ollama or ChatGPT based on aiModel
      // For now, we'll use a mock response
      const mockResponse = {
        original: request.text,
        improved: `This is the improved text using ${aiModel}.`,
        mistakes: [
          {
            original: "example mistake",
            correction: "corrected example",
            explanation: `Explanation of the correction using ${aiModel}`,
          },
        ],
      };
      sendResponse(mockResponse);
    });
  }
  return true;
});
