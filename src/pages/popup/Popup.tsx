import React, { useState, useEffect } from "react";
import logo from "@assets/img/logo.svg";

// New component for the input field
const ModeInput = ({
  mode,
  value,
  onChange,
}: {
  mode: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  const placeholder = mode === "ollama" ? "Enter Ollama URL" : "Enter API Key";
  const isHidden = mode !== "ollama" && mode !== "api";
  // visibility: hidden is not supported in Tailwind
  return (
    <div className={`mt-4 ${isHidden ? "invisible" : ""}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input input-bordered w-full"
      />
    </div>
  );
};

function Popup() {
  const [mode, setMode] = useState<string>("free");
  const [inputValue, setInputValue] = useState<string>("");

  const openChatGPT = () => {
    chrome.tabs.query({ url: "https://chat.openai.com/*" }, (tabs) => {
      if (tabs.length === 0) {
        chrome.tabs.create({ url: "https://chat.openai.com/" });
      } else {
        chrome.tabs.update(tabs[0].id!, { active: true });
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
    chrome.storage.sync.get(["mode", "ollamaUrl", "apiKey"], (result) => {
      if (result.mode) setMode(result.mode);
      if (result.ollamaUrl && result.mode === "ollama")
        setInputValue(result.ollamaUrl);
      if (result.apiKey && result.mode === "api") setInputValue(result.apiKey);
    });
  }, []);

  // Clear input value when mode changes
  useEffect(() => {
    setInputValue("");
  }, [mode]);

  return (
    <div className="p-4 bg-base-100 rounded shadow-md w-full">
      <img src={logo} alt="Logo" className="w-16 h-16 mx-auto mb-4" />
      <h2 className="text-xl font-semibold mb-4 text-center">Select Mode</h2>
      <div className="space-y-2">
        {["free", "ollama", "api", "full"].map((option) => (
          <div key={option} className="form-control">
            <label className="label cursor-pointer justify-start">
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={mode === option}
                onChange={() => setMode(option)}
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
