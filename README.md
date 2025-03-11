# English-Vietnamese Dictionary Chrome Extension

A Chrome extension that provides instant English to Vietnamese translations and definitions using Google's Gemini AI. Look up words by selecting text on any webpage or searching directly in the extension popup.

## Features

- Double-click or right-click to look up English words on any webpage
- Get detailed Vietnamese translations and definitions powered by Google Gemini AI
- Save favorite words for future reference
- View phonetic pronunciations, part of speech, definitions, and example sentences
- Clean, intuitive user interface

## Installation

1. Clone this repository:

```bash
git clone https://github.com/yourusername/english-vietnamese-dictionary.git
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your Google Gemini API key:

```bash
REACT_APP_GEMINI_API_KEY=your_api_key_here
```

4. Build the extension:

```bash
npm run build
```

5. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `build` folder

## Development

- Run the development build with watch mode:

```bash
npm run watch
```

- The project uses:
  - React with TypeScript
  - Google Generative AI (Gemini)
  - Chrome Extension Manifest V3
  - Webpack for building

## Project Structure

- `/src`
  - `components/` - React components for the popup UI
  - `services/` - API and storage service functions
  - `background.ts` - Extension background service worker
  - `content.ts` - Content script for webpage integration
  - `App.tsx` - Main React application
- `/public` - Static assets and manifest.json

## Usage

1. **Quick Lookup**

   - Double-click any English word on a webpage
   - Click the dictionary icon that appears
   - Or right-click and select "Look up in EN-VI Dictionary"

2. **Search**

   - Click the extension icon in Chrome toolbar
   - Enter a word in the search box
   - View detailed translations and definitions

3. **Save Words**
   - Click "Save Word" on any definition
   - Access saved words through the "Saved Words" tab
   - Remove words from saved list as needed
