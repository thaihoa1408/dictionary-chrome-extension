import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// Check if there's a word to look up from double-click or context menu
chrome.storage.local.get("lookupWord", (data) => {
  root.render(
    <React.StrictMode>
      <App initialWord={data.lookupWord || ""} />
    </React.StrictMode>
  );

  // Clear the stored word after using it
  if (data.lookupWord) {
    chrome.storage.local.remove("lookupWord");
  }
});
