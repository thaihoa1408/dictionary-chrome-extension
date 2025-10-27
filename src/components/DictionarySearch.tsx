import React, { useState, useEffect } from "react";
import { lookupWord } from "../services/dictionaryService";
import { saveWord } from "../services/storageService";

interface WordResult {
  word: string;
  phonetic?: string;
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
      synonyms?: string[];
    }[];
  }[];
}

interface DictionarySearchProps {
  initialWord?: string;
}

const DictionarySearch: React.FC<DictionarySearchProps> = ({
  initialWord = "",
}) => {
  const [searchTerm, setSearchTerm] = useState(initialWord);
  const [result, setResult] = useState<WordResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Automatically search for the initial word
  useEffect(() => {
    if (initialWord) {
      setSearchTerm(initialWord);
      handleSearch(null, initialWord);
    }
  }, [initialWord]);

  const handleSearch = async (
    e: React.FormEvent | null,
    wordToSearch?: string
  ) => {
    if (e) e.preventDefault();

    const term = wordToSearch || searchTerm;
    if (!term.trim()) return;

    setLoading(true);
    setError("");

    try {
      const data = await lookupWord(term);
      setResult(data);
    } catch (err) {
      setError("Failed to find the word. Please try again.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWord = () => {
    if (result) {
      saveWord(result);
      alert("Word saved successfully!");
    }
  };

  return (
    <div className="dictionary-search">
      <form onSubmit={(e) => handleSearch(e)}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter an English word..."
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="result">
          <div className="word-header">
            <h2>{result.word}</h2>
            {result.phonetic && (
              <span className="phonetic">{result.phonetic}</span>
            )}
            <button onClick={handleSaveWord} className="save-button">
              Save Word
            </button>
          </div>

          {result.meanings.map((meaning, index) => (
            <div key={index} className="meaning">
              <h3>{meaning.partOfSpeech}</h3>
              {/* <p className="vietnamese">{meaning.vietnameseMeaning}</p> */}

              <div className="definitions">
                {meaning.definitions.map((def, i) => (
                  <div key={i} className="definition">
                    <p>{def.definition}</p>
                    {def.example && (
                      <p className="example">Example: {def.example}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DictionarySearch;
