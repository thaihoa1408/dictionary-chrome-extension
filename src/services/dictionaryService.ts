// This service connects to the Google Gemini API for dictionary lookups

import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config";

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

// Initialize the Google Generative AI with your API key from environment variable
const API_KEY = config.GOOGLE_AI_API_KEY;
if (!API_KEY) {
  throw new Error("GOOGLE_AI_API_KEY environment variable is not set");
}
const genAI = new GoogleGenerativeAI(API_KEY);

export const lookupWord = async (word: string): Promise<WordResult> => {
  // Normalize the word
  const normalizedWord = word.toLowerCase().trim();

  try {
    // Simulate network delay (optional - remove in production)
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Create a prompt for Gemini that asks for dictionary information
    const prompt = `
      Act as a comprehensive English-Vietnamese dictionary.
      
      For the English word "${normalizedWord}", please provide:
      1. The correct spelling
      2. Phonetic pronunciation
      3. All possible parts of speech (noun, verb, adjective, etc.)
      4. For each part of speech:
         - Clear definitions in Vietnamese
         - Example sentences for each definition
         - Common synonyms (if applicable)
      
      Format your response as structured data that can be parsed as JSON with this structure:
      {
        "word": "string",
        "phonetic": "string",
        "meanings": [
          {
            "partOfSpeech": "string",
            "definitions": [
              {
                "definition": "string",
                "example": "string",
                "synonyms": ["string"]
              }
            ],
          }
        ]
      }
    `;

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract the JSON from the response
    // The response might contain markdown formatting or additional text
    const jsonMatch =
      text.match(/```json\n([\s\S]*?)\n```/) ||
      text.match(/```\n([\s\S]*?)\n```/) ||
      text.match(/{[\s\S]*?}/);

    let parsedData: WordResult;

    if (jsonMatch) {
      // If we found JSON in markdown code blocks
      parsedData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
    } else {
      // Try to parse the entire response as JSON
      try {
        parsedData = JSON.parse(text);
      } catch (e) {
        // If parsing fails, create a basic structure with the raw text
        throw new Error("Failed to parse Gemini response");
      }
    }

    // Ensure the response matches our WordResult interface
    return {
      word: parsedData.word || normalizedWord,
      phonetic: parsedData.phonetic || "",
      meanings: parsedData.meanings.map((meaning) => ({
        partOfSpeech: meaning.partOfSpeech,
        definitions: meaning.definitions.map((def) => ({
          definition: def.definition,
          example: def.example,
          synonyms: def.synonyms || [],
        })),
      })),
    };
  } catch (error) {
    console.error("Error looking up word with Gemini:", error);
    throw new Error("Word not found");
  }
};
