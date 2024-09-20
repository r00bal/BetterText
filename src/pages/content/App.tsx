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

  return (
    <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <textarea
        className="border-0 border-slate-400"
        value="Lotem sdfsfsfc sfdsdfcsdcs fsdfc"
      />

      <div className="w-full relative inset-0 border border-solid border-slate-300 rounded-md min-h-52">
        {isLoading && (
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={1000}
            className="w-full h-full"
            particleColor="#000"
          />
        )}
      </div>
      {improvedText && <Card data={improvedText} />}
    </Drawer>
  );
};

export default App;
