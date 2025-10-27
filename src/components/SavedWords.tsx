import React, { useState, useEffect } from "react";
import { getSavedWords, removeWord } from "../services/storageService";

interface SavedWord {
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
  savedAt?: number;
}

const SavedWords: React.FC = () => {
  const [savedWords, setSavedWords] = useState<SavedWord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedWords = async () => {
      const words = await getSavedWords();
      setSavedWords(words);
      setLoading(false);
    };

    fetchSavedWords();
  }, []);

  const handleRemoveWord = async (word: string) => {
    await removeWord(word);
    setSavedWords(savedWords.filter((w) => w.word !== word));
  };

  const formatSavedTime = (timestamp?: number): string => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  if (loading) {
    return <div>Loading saved words...</div>;
  }

  if (savedWords.length === 0) {
    return (
      <div className="no-saved-words">You haven't saved any words yet.</div>
    );
  }

  return (
    <div className="saved-words">
      <h2>Your Saved Words</h2>
      <div className="word-list">
        {savedWords.map((wordItem) => (
          <div key={wordItem.word} className="saved-word-item">
            <div className="word-header">
              <h3>{wordItem.word}</h3>
              {wordItem.phonetic && (
                <span className="phonetic">{wordItem.phonetic}</span>
              )}
              <button
                onClick={() => handleRemoveWord(wordItem.word)}
                className="remove-button"
              >
                Remove
              </button>
            </div>
            {wordItem.savedAt && (
              <div className="saved-time">
                Saved on: {formatSavedTime(wordItem.savedAt)}
              </div>
            )}
            <div className="meanings">
              {wordItem.meanings.map((meaning, index) => (
                <div key={index} className="meaning">
                  <span className="part-of-speech">
                    {meaning.partOfSpeech}:
                  </span>
                  <div className="definitions">
                    {meaning.definitions &&
                      meaning.definitions.map((def, i) => (
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedWords;
