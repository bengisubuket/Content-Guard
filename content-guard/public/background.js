var userSettings; // Global variable to store the keywordsList

loadSettings(); // Load user settings from chrome.storage
// ================================ Settings ================================================================================

// Function to save user settings to chrome.storage
function saveSettings() {
    // Save userSettings to chrome.storage.local
    chrome.storage.local.set({'userSettings': userSettings}, function() {
        console.log('User settings saved:', userSettings);
    });
    broadcastKeywords();
}

// Function to load user settings from chrome.storage
function loadSettings() {
    // Retrieve userSettings from chrome.storage.local
    chrome.storage.local.get('userSettings', function(data) {
        console.log('User settings loaded:', data.user);
        userSettings = data.userSettings;
        
        if (userSettings === undefined){
            userSettings = {
                "username": "uname",
                "id": 492,
                "keywords": [],
                "categories": [],
                "activeKeywords": [],
                "activeCategories": []
            };
            saveSettings();
            return;
        }
        console.log('User settings loaded:', userSettings);
        // Call the callback function with the loaded user settings
        loadedSettings();
    });
}

function loadedSettings() {
    console.log("Settings are ready to use.");
    
    //saveSettings();
}


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
            userSettings.keywords = request.data;
            
            userSettings.activeKeywords = [];
            userSettings.keywords.forEach((kwObj) => {
                userSettings.activeKeywords.push(kwObj.name);
            });

            saveSettings();
        }
        return true; // Keeps the message channel open for async response
    }
);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // Check for the correct action
        if (request.action === "keywordDeleted") {
            userSettings.keywords = request.data;
            
            userSettings.activeKeywords = [];
            userSettings.keywords.forEach((kwObj) => {
                userSettings.activeKeywords.push(kwObj.name);
            });
            
            saveSettings();
        }
        return true; // Keeps the message channel open for async response
    }
);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // Check for the correct action
        if (request.action === "updateCategories") {
            userSettings.activeCategories = request.data;
            saveSettings();   
        }
        return true; // Keeps the message channel open for async response
    }
);

// send message to KeywordBlocker.jsx
  
// Function to broadcast keywordsList to all tabs
function broadcastKeywords() {
    console.log("activeKeywords:", userSettings.activeKeywords);
    chrome.tabs.query({}, function(tabs) {
        for (let tab of tabs) {
            if (tab.url && tab.url.includes("twitter.com")) {
                chrome.tabs.sendMessage(tab.id, {
                    type: "filters",
                    activeKeywords: userSettings.activeKeywords,
                    activeCategories: userSettings.activeCategories
                });
            }
        }
    });
}
