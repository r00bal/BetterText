console.log("background script loaded");

const generateCodeSuggestionFromOllama = async (prompt: string) => {
  const apiUrl = `http://localhost:11434/api/generate`;
  const body = {
    model: "llama3.1",
    prompt: prompt,
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
  return `Correct english, friendly simple style. In response wrtie only corrected text, nothing else: ${text}`;
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "ImproveText",
    title: "Improve Text",
    contexts: ["selection"],
    type: "normal",
  });
});

chrome.contextMenus.onClicked.addListener(async (item) => {
  console.log(item);
  const text = item.selectionText;
  if (!text) return;
  const prompt = createPrompt(text);
  const response = await generateCodeSuggestionFromOllama(prompt);
  console.log(response);
});
