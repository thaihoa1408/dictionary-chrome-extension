/// <reference types="chrome"/>

interface WordData {
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

export const saveWord = async (wordData: WordData): Promise<void> => {
  try {
    // Get current saved words
    const { savedWords = {} } = await chrome.storage.sync.get("savedWords");

    // Add new word with timestamp
    savedWords[wordData.word] = {
      word: wordData.word,
      phonetic: wordData.phonetic,
      meanings: wordData.meanings,
      savedAt: Date.now(),
    };

    // Save back to storage
    await chrome.storage.sync.set({ savedWords });
  } catch (error) {
    console.error("Error saving word:", error);
    throw error;
  }
};

export const getSavedWords = async (): Promise<WordData[]> => {
  try {
    const { savedWords = {} } = await chrome.storage.sync.get("savedWords");
    return Object.values(savedWords as Record<string, WordData>).sort(
      (a, b) => {
        const timeA = a.savedAt || 0;
        const timeB = b.savedAt || 0;
        return timeB - timeA;
      }
    );
  } catch (error) {
    console.error("Error getting saved words:", error);
    return [];
  }
};

export const removeWord = async (word: string): Promise<void> => {
  try {
    const { savedWords = {} } = await chrome.storage.sync.get("savedWords");

    if (savedWords[word]) {
      delete savedWords[word];
      await chrome.storage.sync.set({ savedWords });
    }
  } catch (error) {
    console.error("Error removing word:", error);
    throw error;
  }
};
