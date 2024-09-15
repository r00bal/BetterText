import { ReactNode } from "react";

export const Button = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="w-9 h-9 flex-auto overflow-hidden rounded-sm bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5 backgr"
    >
      {children}
    </button>
  );
};
