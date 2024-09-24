import { createRoot } from "react-dom/client";
import App from "./App";
import "./style.css";
const div = document.createElement("div");
div.id = "__root";
document.body.appendChild(div);

const rootContainer = document.querySelector("#__root");
if (!rootContainer) throw new Error("Can't find Content root element");
const root = createRoot(rootContainer);
root.render(
  <App />
  // <div className="absolute bottom-0 left-0 text-black bg-amber-400 z-[1000]">

  //   content script loaded
  // </div>
);

try {
  console.log("content script loaded");
} catch (e) {
  console.error(e);
}
