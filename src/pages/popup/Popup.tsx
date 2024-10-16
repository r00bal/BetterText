import React, { useState, useEffect } from "react";
import logo from "@assets/img/logo.svg";
import { ModeInput } from "./ModeInput";

function Popup() {
  const [mode, setMode] = useState<Mode>("ollama");
  const [inputValue, setInputValue] = useState<string>("");

  const handleSubmit = () => {
    switch (mode) {
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
    chrome.storage.sync.get(storageOptions, (result) => {
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
                {option === "ollama" && "Ollama Local"}
                {option === "api" && "Use OpeanAI API Key"}
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

export const storageOptions = ["mode", "ollamaUrl", "apiKey"] as const;
export type StorageOptions = (typeof storageOptions)[number];

export type StorageSync = {
  [K in StorageOptions]: K extends "mode" ? Mode : string;
};

export const options = ["ollama", "api", "full"] as const;
export type Mode = (typeof options)[number];
