import React from "react";
import Drawer from "./Drawer";
import Card from "./Card";
import { LoaderSparkles } from "./LoaderSparkles";
import { useBackgroundComunication } from "./hoooks/useBackgroundComunication";
import { TypewriterEffect } from "@src/components/ui/typewriter-effect";
import { Collapse } from "./Collapse";
import { Loader } from "./Loader";
import { motion } from "framer-motion";

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

  const { improved, explanation = [] } = improvedText || {};

  return (
    <>
      <button onClick={() => setIsOpen((open) => !open)}>
        OPEN BETTER ENGLISH
      </button>
      {isOpen && (
        <motion.div
          drag
          className="card bg-base-100 w-96 shadow-xl fixed top-[50px] right-[50px] z-[100000]"
        >
          <div className="card-body p-2 rounded-sm">
            <div className="card-actions justify-end">
              <button
                className="btn btn-outline btn-secondary"
                onClick={() => {
                  setIsOpen(false);
                  setSelectedText("");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div>
              <Collapse title="Orginal">
                <textarea
                  className="text-gray-500 w-full [field-sizing:content] overflow-y-auto rounded-md text-xs font-light bg-zinc-50 p-2 border border-zinc-300 border-solid"
                  value={selectedText}
                />
              </Collapse>
              <Collapse isOpen={true}>
                <Loader isLoading={isLoading} />
                {!isLoading && improved && (
                  <TypewriterEffect
                    words={improved
                      .split(" ")
                      .map((word: string) => ({ text: word }))}
                  />
                )}
              </Collapse>
              <Collapse title="Changes">
                <Loader isLoading={isLoading} />
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
                {/* <div className="card-body p-2 rounded-sm">

                </div> */}
              </Collapse>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default App;
