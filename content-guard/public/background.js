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

// keywordList update
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('Message received in background:', request);
    if (request.keywordsList) {
      keywordsList = request.keywordsList;
      broadcastKeywords();
      sendResponse({ status: 'keywords updated' });
    } else if (request.request === "getKeywords") {
      sendResponse({ keywordsList: keywordsList });
    }
    return true;
});
  
// Function to broadcast keywordsList to all tabs
function broadcastKeywords() {
    chrome.tabs.query({}, function(tabs) {
        for (let tab of tabs) {
            if (tab.url && tab.url.includes("twitter.com")) {
            chrome.tabs.sendMessage(tab.id, {
                type: "NEW",
                keywords: keywordsList
            });
            }
        }
    });
}
