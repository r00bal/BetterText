import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const RightSideMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cord, setCord] = useState({ top: 0, left: 0 });
  const { top, left } = cord;

  const handleCloseModal = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    function logSelection(event: MouseEvent) {
      console.log(event);
      const left = event.clientX;
      const top = event.clientY;
      setIsOpen(true);
      setCord({ top, left });
    }

    document.addEventListener("mouseup", logSelection);
    return () => {
      document.removeEventListener("mouseup", logSelection);
    };
  }, []);

  return (
    <div className={`fixed`} style={{ top, left }}>
      {/* Button to toggle the menu */}
      {/* Right side menu */}
      <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
        {/* Content of the menu */}
        <div className="p-4">
          <h2 className="text-lg font-semibold">Right Side Menu</h2>
          <p className="mt-2 text-sm">
            This is a content area inside the right-side menu. Add your custom
            content here.
          </p>
          <button onClick={handleCloseModal}>Close</button>
        </div>
      </div>
    </div>
  );
};

const div = document.createElement("div");
div.id = "__root";
document.body.appendChild(div);

const rootContainer = document.querySelector("#__root");
if (!rootContainer) throw new Error("Can't find Content root element");
const root = createRoot(rootContainer);
root.render(<RightSideMenu />);

try {
  console.log("content script loaded");
} catch (e) {
  console.error(e);
}
