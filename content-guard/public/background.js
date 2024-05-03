var userSettings; // Global variable to store the keywordsList
let twitterTabCount = 0;

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

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // Check for the correct action
        if (request.action === "updateKeywords") {
            // Send the message to content script
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, request, function(response) {
                    console.log("Received response from content script");
                });
            });
        }
        return true; // Keeps the message channel open for async response
    }
);

function handleTimers(){
    timerLoop = 0;
    timerInterval = setInterval(() => {
        loadSettings(); // check if a new timer has been added
        userSettings.keywordsList.forEach(keyword => {
            userSettings.timers[keyword].remaining = userSettings.timers[keyword].remaining - 1000; // decrement every second
            if(userSettings.timers[keyword].remaining <= 0){
                if(userSettings.timers[keyword].type === "block"){
                    delete userSettings.timers[keyword];
                    delete userSettings.keywords[userSettings.keywords.indexOf(keyword)];
                    delete userSettings.activeKeywords[userSettings.activeKeywords.indexOf(keyword)];
                }
                else if(userSettings.timers[keyword].type === "allow"){
                    userSettings.activeKeywords.push(keyword);
                    delete userSettings.timers[keyword];
                }
            }
        });
        if(timerLoop++ % 30 === 0){ // save every 30 seconds
            saveSettings();
        }
        chrome.tabs.query({url: '*://twitter.com/*'}, function(tabs) {
            if (tabs.length === 0){
                saveSettings();
                clearInterval(timerInterval);
            }
        });
    }, 1000)
}

// // keywordList update
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     console.log('Message received in background:', request);
//     if (request.keywordsList) {
//       keywordsList = request.keywordsList;
//       broadcastKeywords();
//       sendResponse({ status: 'keywords updated' });
//     } else if (request.request === "getKeywords") {
//       sendResponse({ keywordsList: keywordsList });
//     }
//     return true;
// });
  
// // Function to broadcast keywordsList to all tabs
// function broadcastKeywords() {
//     chrome.tabs.query({}, function(tabs) {
//         for (let tab of tabs) {
//             if (tab.url && tab.url.includes("twitter.com")) {
//             chrome.tabs.sendMessage(tab.id, {
//                 type: "KWs",
//                 keywords: keywordsList
//             });
//             }
//         }
//     });
// }
