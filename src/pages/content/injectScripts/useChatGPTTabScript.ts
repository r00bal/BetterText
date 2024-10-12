console.log("useChatGPTTabScript");

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request) => {
  console.log("request", request);
  if (request.action === "askChatGPT") {
    askChatGPT(request.prompt);
  }
});

async function waitForElement<T extends Element>(selector: string): Promise<T> {
  return new Promise((resolve) => {
    // Function to fetch the latest element matching the selector
    const getLatestElement = () => {
      const elements = document.querySelectorAll<T>(selector);
      return elements.length > 0 ? elements[elements.length - 1] : null;
    };

    // Check if the element already exists
    const existingElement = getLatestElement();
    if (existingElement) {
      resolve(existingElement);
      return;
    }

    // Create a MutationObserver to watch for new elements matching the selector
    const observer = new MutationObserver((mutations, obs) => {
      const newElement = getLatestElement();
      if (newElement) {
        resolve(newElement);
        obs.disconnect();
      }
    });

    // Start observing the document body for added nodes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}
function ListenForNewElements(callback: () => void) {
  // Create a MutationObserver to watch for new elements matching the selector
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (
          node instanceof HTMLElement &&
          node?.classList?.contains("hidden")
        ) {
          callback();
        }
      }
    }
  });

  // Start observing the document body for added nodes
  observer.observe(document.body, {
    childList: true,
    subtree: true,
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

    sendButton.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      })
    );
  }

  ListenForNewElements(async () => {
    const responseElement = await waitForElement<HTMLElement>(".language-json");
    console.log("responseElement", responseElement);
    if (responseElement) {
      const response = responseElement.innerText;
      console.log("response", response);

      if (response) {
        chrome.storage.local.set({ improveEnglish: response });
      }
    }
  });
}

chrome.runtime.sendMessage("contentScriptReady");
