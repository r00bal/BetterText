//  ``

export const Difference = ({
  original,
  correction,
  onDiffClick,
}: {
  original: string;
  correction: string;
  onDiffClick?: () => void;
}) => {
  return (
    <span onClick={onDiffClick} className="cursor-pointer">
      <span className="!text-rose-600 !bg-red-200 !font-bold px-1 py-0.5">
        {original}
      </span>
      <span className="bg-green-200 text-green-600 font-bold px-1 py-0.5">
        {correction}
      </span>
      {"  "}
    </span>
  );
};
