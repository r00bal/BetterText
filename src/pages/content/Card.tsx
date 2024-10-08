import React from "react";
import { ImprovedTextResposne } from "./App";
import { TypewriterEffect } from "@src/components/ui/typewriter-effect";

type CardProps = {
  data?: ImprovedTextResposne | null;
};

const Card: React.FC<CardProps> = ({ data }) => {
  if (!data) return null;
  const { improved, explanation } = data || {};
  return (
    <div className="flex flex-col justify-start text-slate-900 w-full rounded-md text-xs font-light mb-2">
      <div className="mb-4">
        <h2 className="mb-2 font-bold text-xs text-blue-500 dark:text-blue-500">
          Improved text:
        </h2>
        <TypewriterEffect
          words={improved.split(" ").map((word: string) => ({ text: word }))}
        />
      </div>
      <div>
        <h2 className="mb-2 font-bold">What and why was changed:</h2>
        <ul>
          {explanation &&
            explanation.map(({ original, correction, explanation }, index) => (
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
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Card;
