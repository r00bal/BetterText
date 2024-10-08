console.log("useChatGPTTabScript");

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request) => {
  console.log("request", request);
  if (request.action === "askChatGPT") {
    console.log("askChatGPT(request.prompt);");
    askChatGPT(request.prompt);
  }
});

async function askChatGPT(prompt: string) {
  // Type the prompt into the textarea
  console.log("Type the prompt into the textarea", prompt);
  const textarea = document.querySelector(
    "#prompt-textarea.ProseMirror[contenteditable='true']"
  ) as HTMLTextAreaElement;
  console.log(textarea);
  if (textarea) {
    textarea.innerHTML = "";
    textarea.textContent = prompt;
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  }
  // wait 5s
  await new Promise((resolve) => setTimeout(resolve, 5000));
  // Click the send button
  const sendButton = document.querySelector(
    'button[data-testid="send-button"]'
  ) as HTMLButtonElement;
  if (sendButton) {
    console.log("click send button");
    sendButton.click();
  }

  // Wait for the response
  await waitForResponse();

  // Extract and send the response back to the extension
  const responseElement = document.querySelector(".markdown") as HTMLElement;
  if (responseElement) {
    const response = responseElement.innerText;
    console.log("response", response);

    chrome.runtime.sendMessage({ action: "chatGPTResponse", response });
  }
}

function waitForResponse(): Promise<void> {
  return new Promise((resolve) => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          const addedNode = mutation.addedNodes[0] as HTMLElement;
          if (addedNode.classList.contains("markdown")) {
            observer.disconnect();
            resolve();
            return;
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
}
