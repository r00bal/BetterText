import React, { useState, useEffect } from "react";
import Drawer from "./Drawer";
import Card, { ImprovedText } from "./Card";

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [improvedText, setImprovedText] = useState<ImprovedText | null>(null);

  useEffect(() => {
    const messageListener = (message: {
      type: string;
      data?: ImprovedText;
    }) => {
      console.log("messageListener", message);
      setImprovedText(message.data as ImprovedText);
      setIsOpen(true);
    };

    chrome.runtime.onMessage.addListener(messageListener);
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  return (
    <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
      {improvedText && <Card data={improvedText} />}
    </Drawer>
  );
};

export default App;
