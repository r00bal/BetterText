import React from "react";
import styles from "./style.css?inline";
import createShadowRoot from "./CreateShadowRoot";

import App from "./App";

const root = createShadowRoot(styles);
if (!root) throw new Error("Can't find Content root element");

root.render(<App />);

try {
  console.log("content script loaded");
} catch (e) {
  console.error(e);
}
