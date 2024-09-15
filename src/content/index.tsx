import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import { Modal } from "./Modal";
import { Button } from "./Button";
import icon from "./assets/pen.png";

const RightSideMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selection, setSelection] = useState("");
  const [cord, setCord] = useState({ top: 0, left: 0 });
  const [buttonCord, setButtonCord] = useState({ top: 0, left: 0 });
  const { top, left } = cord || {};
  const { top: topButtonCord, left: leftButtonCord } = buttonCord || {};

  const handleCloseModal = () => {
    setIsOpen(false);
    setIsModalOpen(false);
  };

  useEffect(() => {
    function handleMouseUp(event: MouseEvent) {
      console.log(event);
      const modalWidth = 200; // Replace with your modal width
      const modalHeight = 200; // Replace with your modal height
      let left = event.clientX;
      let top = event.clientY;
      const selection = window.getSelection()?.toString().trim();
      console.log({ selection });

      if (!selection) {
        setIsOpen(false);
        setIsModalOpen(false);
        setSelection("");
        return;
      }
      if (window.innerWidth - left < modalWidth) {
        left = event.clientX - modalWidth;
      }
      if (window.innerHeight - top < modalHeight) {
        top = event.clientY - modalHeight;
      }
      setSelection(selection);
      setIsOpen(true);
      setCord({ top, left });
      setButtonCord({ top: event.clientY, left: event.clientX });
    }

    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <>
      <div
        className="fixed"
        style={{ top: topButtonCord, left: leftButtonCord }}
      >
        {isOpen && (
          <Button
            onClick={() => {
              setIsModalOpen(true);
              setIsOpen(false);
            }}
          >
            <img src={chrome.runtime.getURL(icon)} />
          </Button>
        )}
      </div>
      <div className="fixed" style={{ top, left }}>
        {isModalOpen && selection && (
          <Modal onCloseModal={handleCloseModal}>{selection}</Modal>
        )}
      </div>
    </>
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
