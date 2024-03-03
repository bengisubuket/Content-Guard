// listen

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log(tab);
    if(tab.url && (tab.url.includes("twitter.com") || changeInfo.status === "loading")) {
        console.log("background.js listener");
        chrome.tabs.sendMessage(tabId, {
            type: "NEW"
        });
    }
});