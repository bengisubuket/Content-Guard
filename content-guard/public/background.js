let keywordsList = []; // Global variable to store the keywordsList

console.log("background.js keywordsList: ", keywordsList);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log(tab);
    if(tab.url && (tab.url.includes("twitter.com") || changeInfo.status === "loading")) {
        console.log("Sending to tabId:", tabId);
        console.log("background.js listener");
        chrome.tabs.sendMessage(tabId, {
            type: "NEW"
        });
    }
});

// userSettings update
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('Message received in background:', request);
    if (request.keywordsList) {
        // Optionally send a response back
        keywordsList = request.keywordsList; // Update the global keywordsList
        broadcastKeywords(); // Broadcast keywordsList to all tabs
        sendResponse({ status: 'keywords received' });
        console.log("Updated keywordsList in background: ", keywordsList);
    }
    return true; // Keep the message channel open for the sendResponse callback
  });
  
// Function to broadcast keywordsList to all tabs
function broadcastKeywords() {
    chrome.tabs.query({}, function(tabs) { // Get all tabs
        for (let tab of tabs) {
            if (tab.url && tab.url.includes("twitter.com")) {
                chrome.tabs.sendMessage(tab.id, {
                    type: "KWs",
                    keywords: keywordsList
                });
            }
        }
    });
}
