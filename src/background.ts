// Set up context menu for word lookup
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "lookupWord",
    title: 'Look up "%s" in EN-VI Dictionary',
    contexts: ["selection"],
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "lookupWord" && info.selectionText) {
    // Open popup with the selected word
    chrome.storage.local.set({ lookupWord: info.selectionText }, () => {
      chrome.action.openPopup();
    });
  }
});

// Mock dictionary data for inline lookup
const mockDictionary: Record<string, string> = {
  hello: "xin chào",
  book: "sách, quyển sách",
  world: "thế giới",
  computer: "máy tính",
  language: "ngôn ngữ",
  dictionary: "từ điển",
};

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "lookupWord" && message.word) {
    // Store the word to look up
    chrome.storage.local.set({ lookupWord: message.word }, () => {
      chrome.action.openPopup();
    });
    return true;
  }

  return false; // Changed from true to false for messages we don't handle
});
