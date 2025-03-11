import React, { useState, useEffect } from "react";
import "./App.css";
import DictionarySearch from "./components/DictionarySearch";
import SavedWords from "./components/SavedWords";

interface AppProps {
  initialWord?: string;
}

function App({ initialWord = "" }: AppProps) {
  const [activeTab, setActiveTab] = useState<"search" | "saved">("search");

  // If there's an initial word, make sure we're on the search tab
  useEffect(() => {
    if (initialWord) {
      setActiveTab("search");
    }
  }, [initialWord]);

  return (
    <div className="App container">
      <header>
        <h1>EN-VI Dictionary</h1>
        <div className="tabs">
          <button
            className={activeTab === "search" ? "active" : ""}
            onClick={() => setActiveTab("search")}
          >
            Search
          </button>
          <button
            className={activeTab === "saved" ? "active" : ""}
            onClick={() => setActiveTab("saved")}
          >
            Saved Words
          </button>
        </div>
      </header>

      <main>
        {activeTab === "search" ? (
          <DictionarySearch initialWord={initialWord} />
        ) : (
          <SavedWords />
        )}
      </main>
    </div>
  );
}

export default App;
