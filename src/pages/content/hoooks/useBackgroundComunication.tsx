import { useState, useEffect } from "react";
import dummyResponse from "./test.json";

type ExplenationList = {
  original: string;
  correction: string;
  explanation: string;
};

export type ImprovedTextResposne = {
  improved: string;
  explanation: ExplenationList[];
};

export const useBackgroundComunication = () => {
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
    };

    chrome.runtime.onMessage.addListener(selectionListener);
    return () => {
      chrome.runtime.onMessage.removeListener(selectionListener);
    };
  }, []);

  // useEffect(() => {
  //   const fetchImprovedText = async () => {
  //     setSelectedText(dummyResponse.original);
  //     setIsLoading(true);
  //     const response = await fakeData();
  //     if (response) {
  //       console.log({ response });
  //       const parsedData: ImprovedTextResposne = JSON.parse(response as string);
  //       console.log({ parsedData });

  //       setImprovedText(parsedData as ImprovedTextResposne);
  //     }
  //     setIsLoading(false);
  //   };
  //   if (isOpen) {
  //     fetchImprovedText();
  //   }
  // }, [isOpen]);

  return {
    isOpen,
    setIsOpen,
    setSelectedText,
    isLoading,
    selectedText,
    improvedText,
  };
};

// const fakeData = () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(JSON.stringify(dummyResponse));
//     }, 4000);
//   });
// };
