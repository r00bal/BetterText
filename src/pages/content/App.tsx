import React, { useState, useEffect } from "react";
import Drawer from "./Drawer";
import Card from "./Card";

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
      setIsOpen(true);
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
    };
    chrome.runtime.onMessage.addListener(openListener);
    return () => {
      chrome.runtime.onMessage.removeListener(openListener);
    };
  }, []);

  return (
    <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
      {improvedText && <Card data={improvedText} />}
    </Drawer>
  );
};

export default App;
