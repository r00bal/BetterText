import React from "react";

interface Mistake {
  original: string;
  correction: string;
  explanation: string;
}

export interface ImprovedText {
  original: string;
  improved: string;
  mistakes: Mistake[];
}

const Card: React.FC<ImprovedText> = ({ original, improved, mistakes }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Original Text</h2>
        <p className="bg-gray-100 p-3 rounded">{original}</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Improved Text</h2>
        <p className="bg-green-100 p-3 rounded">{improved}</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Mistakes</h2>
        <ul className="space-y-4">
          {mistakes.map((mistake, index) => (
            <li key={index} className="bg-yellow-100 p-3 rounded">
              <p>
                <strong>Original:</strong> {mistake.original}
              </p>
              <p>
                <strong>Correction:</strong> {mistake.correction}
              </p>
              <p>
                <strong>Explanation:</strong> {mistake.explanation}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Card;
