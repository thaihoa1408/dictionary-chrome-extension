// Listen for text selection
document.addEventListener("mouseup", (event) => {
  const selection = window.getSelection();
  if (selection && selection.toString().trim()) {
    // Remove any existing selection icon
    removeSelectionIcon();

    // Create and show the selection icon
    createSelectionIcon(selection);
  } else {
    // Remove the icon if no text is selected
    // removeSelectionIcon();
  }
});

// Remove icon when clicking elsewhere
document.addEventListener("mousedown", (event) => {
  const icon = document.getElementById("en-vi-dictionary-icon");
  if (icon && !icon.contains(event.target as Node)) {
    removeSelectionIcon();
  }
});

// Create a small icon near the selected text
function createSelectionIcon(selection: Selection) {
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  const icon = document.createElement("div");
  icon.id = "en-vi-dictionary-icon";
  icon.style.position = "absolute";
  icon.style.left = `${rect.left + window.scrollX}px`;
  icon.style.top = `${rect.bottom + window.scrollY + 5}px`;
  icon.style.width = "24px";
  icon.style.height = "24px";
  icon.style.borderRadius = "50%";
  icon.style.backgroundColor = "#3498db";
  icon.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
  icon.style.cursor = "pointer";
  icon.style.zIndex = "10000";
  icon.style.display = "flex";
  icon.style.alignItems = "center";
  icon.style.justifyContent = "center";

  // Add a dictionary icon (using a simple text character for simplicity)
  icon.innerHTML = `<span style="color: white; font-weight: bold; font-size: 14px;">D</span>`;
  const selectedText = selection.toString().trim();

  // Add click handler
  icon.addEventListener("click", (event) => {
    event.stopPropagation();

    console.log("Selected text:", selectedText);
    lookupSelectedWord(selectedText, rect);
  });

  document.body.appendChild(icon);
}

// Remove the selection icon
function removeSelectionIcon() {
  const icon = document.getElementById("en-vi-dictionary-icon");
  if (icon) {
    icon.remove();
  }
}

// Look up the selected word and show definition
async function lookupSelectedWord(word: string, rect: DOMRect) {
  try {
    // First, remove the selection icon
    removeSelectionIcon();

    chrome.runtime.sendMessage({
      action: "lookupWord",
      word: word,
    });
  } catch (error) {
    console.error("Error looking up word:", error);
  }
}
