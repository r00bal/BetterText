import React, { useEffect, useMemo, useState } from "react";
import { useBackgroundComunication } from "./hoooks/useBackgroundComunication";
import { TypewriterEffect } from "@src/components/ui/typewriter-effect";
import { Collapse } from "./Collapse";
import { Loader } from "./Loader";
import { motion, useDragControls } from "framer-motion";
import { Difference } from "./Difference";

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
  const controls = useDragControls();

  const [constraints, setConstraints] = useState({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  });

  const [activeExplenation, setActiveExplenation] = useState<null | string>(
    null
  );

  useEffect(() => {
    const updateConstraints = () => {
      const cardElement = document.querySelector(".card");
      if (cardElement) {
        const rect = cardElement.getBoundingClientRect();
        setConstraints({
          left: -rect.left,
          right: window.innerWidth - rect.right,
          top: -rect.top,
          bottom: window.innerHeight - rect.bottom,
        });
      }
    };

    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    return () => window.removeEventListener("resize", updateConstraints);
  }, [isOpen]);

  function startDrag(event) {
    controls.start(event);
  }

  const normalizeText = (text: string) => text.replace(/\s+/g, " ").trim();

  const markSelectedText = (text: string, originals: string[]) => {
    let markedText = text;
    originals.forEach((original) => {
      markedText = markedText.replace(original, `|${original}|`);
    });
    return markedText;
  };

  const createDifferenceArray = (
    markedText: string,
    originals: string[],
    explanations: ExplenationList[]
  ) => {
    return markedText.split("|").map((text) => {
      const isDiff = originals.some((original) =>
        normalizeText(text).includes(normalizeText(original))
      );

      if (isDiff) {
        const explanation = explanations.find(
          ({ original }) =>
            original === text ||
            normalizeText(text).includes(normalizeText(original))
        );
        return { diff: true, ...explanation };
      }

      return { text, diff: false };
    });
  };

  const differenceArray = useMemo(() => {
    const originalTextArray = explanation.map(({ original }) => original);
    const markedSelectedText = markSelectedText(
      selectedText,
      originalTextArray
    );
    return createDifferenceArray(
      markedSelectedText,
      originalTextArray,
      explanation
    );
  }, [selectedText, explanation]);

  console.log(differenceArray);

  return (
    <>
      <button onClick={() => setIsOpen((open) => !open)}>
        OPEN BETTER ENGLISH
      </button>
      {isOpen && (
        <>
          <motion.div
            drag
            dragControls={controls}
            dragConstraints={constraints}
            dragListener={false}
            className="card w-96 shadow-xl fixed top-[50px] right-[50px] z-[100000] border border-solid border-gray-300"
          >
            <div
              className="w-full h-10 absolute top-0 rounded-t-2xl z-[100002] card-actions justify-end border-b border-solid border-gray-300 bg-gray-50"
              onPointerDown={startDrag}
            >
              {" "}
              <button
                className="btn btn-square btn-outline z-[100005] h-10 min-h-10 p-0 border-0"
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
            <div className="card-body rounded-sm z-[100003] p-4 mt-10">
              <div>
                <Collapse title="Orginal">
                  <div
                    onPointerDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <textarea
                      className="text-gray-500 w-full [field-sizing:content] overflow-y-auto rounded-md text-xs font-light bg-zinc-50 p-2 border border-zinc-300 border-solid"
                      value={selectedText}
                    />
                  </div>
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
                  <div className="card-body p-2 rounded-sm">
                    <div className="rounded-md text-xs bg-zinc-50 p-4 border border-zinc-300 border-solid font-normal text-neutral-700 dark:text-neutral-200 leading-6">
                      {differenceArray.map((text) => {
                        return text.diff ? (
                          <Difference
                            key={text.original}
                            original={text.original}
                            correction={text.correction}
                            onDiffClick={() => {
                              setActiveExplenation(text.explanation);
                            }}
                          />
                        ) : (
                          <span key={text.text}>{text.text}</span>
                        );
                      })}
                    </div>
                  </div>
                  <div className="card-body p-2 rounded-sm">
                    {activeExplenation}
                  </div>
                </Collapse>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
};

export default App;
