import React, { useState, useEffect } from "react";
import Drawer from "./Drawer";
import Card from "./Card";
import { LoaderSparkles } from "./LoaderSparkles";

type ExplenationList = {
  original: string;
  correction: string;
  explanation: string;
};

export type ImprovedTextResposne = {
  improved: string;
  explanation: ExplenationList[];
};

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState<string>("");
  const [improvedText, setImprovedText] = useState<ImprovedTextResposne | null>(
    null
  );

  useEffect(() => {
    const messageListener = (message: { action: string; data?: string }) => {
      if (message.action !== "improveEnglish") return;
      console.log("messageListener", message);
      const parsedData: ImprovedTextResposne = JSON.parse(
        message?.data as string
      );
      console.log({ parsedData });
      setImprovedText(parsedData);
      setIsLoading(false);
    };
    chrome.runtime.onMessage.addListener(messageListener);
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  useEffect(() => {
    const openListener = (message: { action: string }) => {
      if (message.action !== "openDrawer") return;
      setIsOpen(true);
      setIsLoading(true);
    };
    chrome.runtime.onMessage.addListener(openListener);
    return () => {
      chrome.runtime.onMessage.removeListener(openListener);
    };
  }, []);

  useEffect(() => {
    const selectionListener = (message: { action: string; data?: string }) => {
      if (message.action !== "selectedText") return;
      setSelectedText(message?.data as string);
      setIsLoading(true);
    };

    chrome.runtime.onMessage.addListener(selectionListener);
    return () => {
      chrome.runtime.onMessage.removeListener(selectionListener);
    };
  }, []);

  return (
    <Drawer
      className="w-1/3 min-w-[400px]"
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
        setSelectedText("");
      }}
    >
      {selectedText && (
        <>
          <h2 className="text-slate-900 w-full rounded-md text-xs font-bold mb-2">
            Oryginal:
          </h2>
          <textarea
            className="text-gray-500 w-full h-auto max-h-[300px] overflow-y-auto rounded-md text-xs mb-4 font-light bg-zinc-50 p-2 border border-zinc-300 border-solid"
            style={{ minHeight: "100px", maxHeight: "300px" }}
            value={selectedText}
          />
        </>
      )}

      <div className="container">
        <LoaderSparkles isLoading={isLoading} />
        <Card data={improvedText} />
      </div>
    </Drawer>
  );
};

export default App;
