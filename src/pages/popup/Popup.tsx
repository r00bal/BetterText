import React, { useState, useEffect } from "react";
import logo from "@assets/img/logo.svg";
import { ModeInput } from "./ModeInput";

function Popup() {
  const [mode, setMode] = useState<Mode>("free");
  const [inputValue, setInputValue] = useState<string>("");

  const openChatGPT = () => {
    chrome.tabs.query({ url: "https://chatgpt.com/*" }, (tabs) => {
      console.log("tabs", tabs);
      if (tabs.length === 0) {
        chrome.tabs.create({ url: "https://chatgpt.com" }, (newTab) => {
          // Save the new tab ID to local storage
          if (newTab.id) {
            console.log("newTab", newTab);
            chrome.storage.sync.set({ chatGPTTabId: newTab.id });
            chrome.scripting.executeScript({
              target: { tabId: newTab.id },
              files: ["src/pages/content/injectScripts/useChatGPTTabScript.ts"],
            });
          }
        });
      } else {
        console.log("tabs", tabs);
        const tabId = tabs[0].id;
        if (tabId) {
          console.log("tabId", tabId);
          chrome.storage.sync.set({ chatGPTTabId: tabId });
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["src/pages/content/injectScripts/useChatGPTTabScript.ts"],
          });
        }
      }
    });
  };

  const handleSubmit = () => {
    switch (mode) {
      case "free":
        openChatGPT();
        break;
      case "ollama":
        chrome.storage.sync.set({ ollamaUrl: inputValue });
        break;
      case "api":
        chrome.storage.sync.set({ apiKey: inputValue });
        break;
      case "full":
        chrome.storage.sync.set({ fullAccess: true });
        break;
    }
    chrome.storage.sync.set({ mode: mode });
  };

  useEffect(() => {
    chrome.storage.sync.get(storageOptions, (result: StorageSync) => {
      if (result.mode) setMode(result.mode as Mode);
      if (result.ollamaUrl && result.mode === "ollama")
        setInputValue(result.ollamaUrl);
      if (result.apiKey && result.mode === "api") setInputValue(result.apiKey);
    });
  }, []);

  const handleModeChange = (mode: Mode) => {
    setMode(mode);
    setInputValue("");
  };

  return (
    <div className="p-4 bg-base-100 rounded shadow-md w-full">
      <img src={logo} alt="Logo" className="w-16 h-16 mx-auto mb-4" />
      <h2 className="text-xl font-semibold mb-4 text-center">Select Mode</h2>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option} className="form-control">
            <label className="label cursor-pointer justify-start">
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={mode === option}
                onChange={() => handleModeChange(option)}
              />
              <span className="label-text ml-2">
                {option === "free" && "Free with ChatGPT"}
                {option === "ollama" && "Ollama Local"}
                {option === "api" && "Use API Key"}
                {option === "full" && "Full Access"}
              </span>
            </label>
          </div>
        ))}
      </div>

      <ModeInput mode={mode} value={inputValue} onChange={setInputValue} />

      <button onClick={handleSubmit} className="btn btn-primary mt-6 w-full">
        Save Settings
      </button>
    </div>
  );
}

export default Popup;

export type Mode = "free" | "ollama" | "api" | "full";

export type StorageSync = {
  mode?: Mode;
  ollamaUrl?: string;
  apiKey?: string;
  chatGPTTabId?: number;
};
export type StorageOptions = "mode" | "ollamaUrl" | "apiKey" | "chatGPTTabId";
export const storageOptions: StorageOptions[] = [
  "mode",
  "ollamaUrl",
  "apiKey",
  "chatGPTTabId",
];
export const options: Mode[] = ["free", "ollama", "api", "full"];
