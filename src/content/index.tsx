import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import { Modal } from "./Modal";
import { Button } from "./Button";
import Image from "./assets/pen.png";

const RightSideMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selection, setSelection] = useState("");
  const [cord, setCord] = useState({ top: 0, left: 0 });
  const { top, left } = cord;

  const handleCloseModal = () => {
    setIsOpen(false);
    setIsModalOpen(false);
  };

  useEffect(() => {
    function logSelection(event: MouseEvent) {
      console.log(event);
      const left = event.clientX;
      const top = event.clientY;
      const selection = window.getSelection()?.toString().trim();
      console.log({ selection });

      if (!selection) {
        setIsOpen(false);
        setIsModalOpen(false);
        setSelection("");
        return;
      }
      setSelection(selection);
      setIsOpen(true);
      setCord({ top, left });
    }

    document.addEventListener("mouseup", logSelection);
    return () => {
      document.removeEventListener("mouseup", logSelection);
    };
  }, []);

  return (
    <div className="fixed" style={{ top, left }}>
      {isOpen && (
        <Button
          onClick={() => {
            setIsModalOpen(true);
            setIsOpen(false);
          }}
        >
          <img src={chrome.runtime.getURL("./assets/pen.png")}>Open Modal</img>
        </Button>
      )}
      {isModalOpen && selection && (
        <Modal onCloseModal={handleCloseModal}>{selection}</Modal>
      )}
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
