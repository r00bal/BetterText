import React from "react";
import { ImprovedTextResposne } from "./App";

type CardProps = {
  data: ImprovedTextResposne;
};

const Card: React.FC<CardProps> = ({
  data: { improved, explanation = [] },
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[12px]  mb-2">Improved Text</h2>
        <p className="bg-gray-100 p-3 rounded text-[10px] ">{improved}</p>
      </div>
      <div>
        <h2 className="text-[12px] mb-2">Mistakes</h2>
        <ul className="space-y-4 text-[10px]">
          {explanation &&
            explanation.map(({ original, correction, explanation }, index) => (
              <li key={index}>
                <p>
                  <span className="font-bold">Original:</span> {original}
                </p>
                <p>
                  <span className="font-bold">Correction:</span> {correction}
                </p>
                <p>
                  <span className="font-bold">Explanation:</span> {explanation}
                </p>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Card;
