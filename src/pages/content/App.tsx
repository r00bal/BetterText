import React, { useState, useEffect } from "react";
import Drawer from "./Drawer";
import Card from "./Card";
import { SparklesCore } from "@src/components/ui/sparkles";

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
  const [selectedText, setSelectedText] = useState<string | null>(null);
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
    const onSelectionChange = () => {
      const selectedText = window.getSelection()?.toString();
      if (!selectedText) return;
      setSelectedText(selectedText);
    };

    document.addEventListener("selectionchange", onSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", onSelectionChange);
    };
  }, []);

  return (
    <Drawer
      className="w-1/3 min-w-[400px]"
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
        setSelectedText(null);
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
        {isLoading && (
          <>
            <h2 className="text-slate-900 w-full rounded-md text-xs font-light mb-4">
              Working on it...
            </h2>
            <div className="w-full h-full max-h-[300px] flex flex-col items-center justify-center overflow-hidden rounded-md">
              <div className="w-full h-full relative">
                <div className="absolute inset-x-20 top-0 left-0 right-0 m-auto bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm"></div>
                <div className="absolute inset-x-20 top-0 left-0 right-0 m-auto bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4"></div>
                <div className="absolute inset-x-60 top-0 left-0 right-0 m-auto bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm"></div>
                <div className="absolute inset-x-60 top-0 left-0 right-0 m-auto bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4"></div>
                <div
                  className="opacity-0 w-full h-[400px]"
                  style={{ opacity: 1 }}
                >
                  <SparklesCore
                    id="tsparticlesfullpage"
                    background="transparent"
                    minSize={0.6}
                    maxSize={1.4}
                    particleDensity={300}
                    className="w-full h-full"
                    particleColor="#000"
                  />
                </div>
                <div className="absolute inset-0 w-full h-[400px] bg-white [mask-image:radial-gradient(100%_80%_at_top,transparent_20%,white)]"></div>
              </div>
            </div>
          </>
        )}
        {improvedText && <Card data={improvedText} />}
      </div>
    </Drawer>
  );
};

export default App;
