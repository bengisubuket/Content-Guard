// listen

chrome.tabs.onUpdated.addListener((tabId, tab) => {
    console.log(tab);
    if(tab.url && tab.url.includes("twitter.com/home")) {
        console.log("background.js listener");
        chrome.tabs.sendMessage(tabId, {
            type: "NEW"
        });
    }
});