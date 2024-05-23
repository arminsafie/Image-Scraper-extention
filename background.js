chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "download") {
    chrome.downloads.download(
      {
        url: message.url,
        filename: message.filename,
        conflictAction: "uniquify",
      },
      (downloadId) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
        } else {
          console.log(`Download initiated with ID: ${downloadId}`);
        }
        sendResponse({ downloadId });
      }
    );
    // Return true to indicate we want to send a response asynchronously
    return true;
  }
});
