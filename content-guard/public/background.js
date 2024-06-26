var userSettings; // Global variable to store the keywordsList
// ================================ Settings ================================================================================

// Function to save user settings to chrome.storage
function saveSettings() {
    // Save userSettings to chrome.storage.local
    chrome.storage.local.set({ 'userSettings': userSettings }, function() {
        console.log('User settings saved:', userSettings);
    });
    broadcastKeywords();
}

// Function to load user settings from chrome.storage
function loadSettings() {
    // Retrieve userSettings from chrome.storage.local
    chrome.storage.local.get('userSettings', function(data) {
        userSettings = data.userSettings;

        if (userSettings === undefined) {
            userSettings = {
                "username": "uname",
                "id": 493,
                "keywords": [],
                "categories": [],
                "activeKeywords": [],
                "activeCategories": []
            };
            saveSettings();
            return;
        }

        loadedSettings();
    });
}

function loadedSettings() {

}


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url && (tab.url.includes("twitter.com") || changeInfo.status === "loading")) {
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
                if (kwObj.timer) {
                    if (kwObj.timer.action === "block")
                        userSettings.activeKeywords.push(kwObj.name);
                } else
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
                if (kwObj.timer) {
                    if (kwObj.timer.action === "block")
                        userSettings.activeKeywords.push(kwObj.name);
                } else
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
            // change later
            userSettings.categories = request.data;

            userSettings.activeCategories = [];
            userSettings.categories.forEach((catObj) => {
                if (catObj.enabled) {
                    if (catObj.timer.enabled) {
                        if (catObj.timer.action == "block")
                            userSettings.activeCategories.push(catObj.name);
                    } else
                        userSettings.activeCategories.push(catObj.name);
                }
            });
            saveSettings();
        }
        return true; // Keeps the message channel open for async response
    }
);

// Function to broadcast keywordsList to all tabs
function broadcastKeywords() {
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

function handleTimers() {
    var lastTime = Date.now(); // Record the initial current time

    timerInterval = setInterval(() => {
        let currentTime = Date.now(); // Get the current time
        let elapsedTime = 2 * (currentTime - lastTime); // Calculate elapsed time since last interval
        lastTime = currentTime; // Update lastTime to the current time for the next interval

        loadSettings(); // Load settings to check if a new timer has been added
        chrome.tabs.query({ url: '*://twitter.com/*' }, function(tabs) {
            if (tabs.length > 0) {

                userSettings.keywords.forEach((keyword, index) => {
                    if (keyword.timer) {
                        keyword.timer.remainingTime -= elapsedTime; // Decrement by the elapsed time

                        if (keyword.timer.remainingTime <= 0) {
                            if (keyword.timer.action === "block") {
                                const keywordIndex = userSettings.activeKeywords.indexOf(keyword.name);
                                if (keywordIndex !== -1) {
                                    userSettings.activeKeywords.splice(keywordIndex, 1);
                                }
                                userSettings.keywords.splice(index, 1);
                            } else if (keyword.timer.action === "allow") {
                                userSettings.activeKeywords.push(keyword.name);
                                userSettings.keywords[index].timer = null;
                            }
                        }
                    }
                });

                userSettings.categories.forEach((category, index) => {
                    if (category.enabled && category.timer.enabled) {
                        category.timer.remainingTime -= elapsedTime; // Decrement by the elapsed time

                        if (category.timer.remainingTime <= 0) {
                            if (category.timer.action === "block") {
                                const categoryIndex = userSettings.activeCategories.indexOf(category.name);
                                if (categoryIndex !== -1) {
                                    userSettings.activeCategories.splice(categoryIndex, 1);
                                }
                                userSettings.categories[index].enabled = false;
                                userSettings.categories[index].timer.enabled = false;
                                userSettings.categories[index].timer.duration = 0;
                                userSettings.categories[index].timer.remainingTime = 0;
                            } else if (category.timer.action === "allow") {
                                userSettings.activeCategories.push(category.name);
                                userSettings.categories[index].timer.enabled = false;
                                userSettings.categories[index].timer.duration = 0;
                                userSettings.categories[index].timer.remainingTime = 0;
                            }
                        }
                    }
                });
                saveSettings(); // Save the updated settings
            }
        });
    }, 1000); // The timer still fires every 1000 milliseconds
}

loadSettings(); // Load user settings from chrome.storage
handleTimers(); // Start the timer for each keyword