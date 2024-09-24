import React from "react";
import Drawer from "./Drawer";
import Card from "./Card";
import { LoaderSparkles } from "./LoaderSparkles";
import { useBackgroundComunication } from "./hoooks/useBackgroundComunication";
import { TypewriterEffect } from "@src/components/ui/typewriter-effect";

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

  const { improved, explanation } = improvedText || {};
  return (
    <>
      <button onClick={() => setIsOpen((open) => !open)}>
        OPEN BETTER ENGLISH
      </button>
      {isOpen && (
        <div className="card bg-base-100 w-96 shadow-xl fixed top-[50px] right-[50px] z-[100000]">
          <div className="card-body p-2 rounded-sm">
            <div className="card-actions justify-end">
              <button
                className="btn btn-square btn-sm"
                onClick={() => {
                  setIsOpen(false);
                  setSelectedText("");
                }}
              >
                CLOSE
              </button>
            </div>
            <div>
              <div className="collapse bg-base-200  text-slate-900 text-xs font-bold mb-2">
                <input type="checkbox" className="min-h-4" />
                <div className="collapse-title text-xs font-medium p-2 min-h-4 leading-4">
                  Oryginal
                </div>
                <div className="collapse-content">
                  <textarea
                    className="text-gray-500 w-full h-auto max-h-[300px] overflow-y-auto rounded-md text-xs font-light bg-zinc-50 p-2 border border-zinc-300 border-solid"
                    style={{ minHeight: "100px", maxHeight: "300px" }}
                    value={selectedText}
                  />
                </div>
              </div>
              <div className="collapse bg-base-200  text-slate-900 text-xs font-bold mb-2">
                <input type="checkbox" />
                <div className="collapse-title">Improved</div>
                <div className="collapse-content flex flex-col justify-start text-slate-900 w-full rounded-md text-xs font-light mb-2">
                  {isLoading && (
                    <span className="loading loading-ring loading-lg m-auto"></span>
                  )}
                  {improved && (
                    <TypewriterEffect
                      words={improved
                        .split(" ")
                        .map((word: string) => ({ text: word }))}
                    />
                  )}
                </div>
              </div>
              <div className="collapse bg-base-200  text-slate-900 text-xs font-bold mb-2">
                <input type="checkbox" />
                <div className="collapse-title">Changes</div>
                <div className="collapse-content">
                  {isLoading && (
                    <span className="loading loading-ring loading-lg"></span>
                  )}
                  <ul>
                    {explanation &&
                      explanation.map(
                        ({ original, correction, explanation }, index) => (
                          <li
                            key={index}
                            className="text-gray-500 w-full h-fit rounded-md text-xs font-light bg-zinc-50 p-2 border border-zinc-300 border-solid mb-4"
                          >
                            <p className="mb-1">
                              <span className="font-bold">Diff : </span>
                              <span className="text-rose-600 bg-red-200 font-bold">
                                {original}
                              </span>{" "}
                              |
                              <span className="bg-green-200 text-green-600 font-bold">
                                {correction}
                              </span>
                            </p>
                            <p>
                              <span className="font-bold">Explanation : </span>
                              {explanation}
                            </p>
                          </li>
                        )
                      )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
