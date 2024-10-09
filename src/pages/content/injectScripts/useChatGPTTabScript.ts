console.log("useChatGPTTabScript");

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("request", request);
  if (request.action === "askChatGPT") {
    console.log("askChatGPT(request.prompt);");
    askChatGPT(request.prompt).then((response) => {
      sendResponse(response);
    });
    return true;
  }
});
async function waitForElement<T extends Element>(selector: string): Promise<T> {
  return new Promise((resolve) => {
    const element = document.querySelector<T>(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver((mutations, obs) => {
      const el = document.querySelector<T>(selector);
      if (el) {
        resolve(el);
        obs.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

async function askChatGPT(prompt: string) {
  // Type the prompt into the textarea

  console.log("Waiting for the textarea to be available");
  const textarea = await waitForElement<HTMLTextAreaElement>(
    "#prompt-textarea.ProseMirror[contenteditable='true']"
  );
  console.log(textarea);
  if (textarea) {
    textarea.focus();
    textarea.innerHTML = "";
    textarea.textContent = prompt;
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  }
  console.log("Type the prompt into the textarea", prompt);
  // wait 5s
  await new Promise((resolve) => setTimeout(resolve, 500));
  // Click the send button
  const sendButton = document.querySelector(
    'button[data-testid="send-button"]'
  ) as HTMLButtonElement;
  if (sendButton) {
    console.log("click send button");
    sendButton.focus();
    sendButton.click();
  }

  // Wait for the response
  await waitForResponse();

  // Extract and send the response back to the extension
  const responseElement = document.querySelector(
    ".language-json"
  ) as HTMLElement;
  if (responseElement) {
    const response = responseElement.innerText;
    console.log("response", response);

    return response;
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

chrome.runtime.sendMessage("contentScriptReady");
