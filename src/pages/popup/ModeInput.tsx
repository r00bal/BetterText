import { Mode } from "./Popup";

export const ModeInput = ({
  mode,
  value,
  onChange,
}: {
  mode: Mode;
  value: string;
  onChange: (value: string) => void;
}) => {
  const placeholder = mode === "ollama" ? "Enter Ollama URL" : "Enter API Key";
  const isHidden = mode !== "ollama" && mode !== "api";

  return (
    <div className={`mt-4 ${isHidden ? "invisible" : ""}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input input-bordered w-full"
      />
    </div>
  );
};
