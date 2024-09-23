import React from "react";
import Drawer from "./Drawer";
import Card from "./Card";
import { LoaderSparkles } from "./LoaderSparkles";
import { useBackgroundComunication } from "./hoooks/useBackgroundComunication";

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
  const {
    isOpen,
    selectedText,
    isLoading,
    improvedText,
    setIsOpen,
    setSelectedText,
  } = useBackgroundComunication();

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
