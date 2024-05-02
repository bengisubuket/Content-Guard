var nodes = [];
var targetNode = null;
var observer = null;

var userSettings;
var kw_filters = [];

// ================================ Settings ================================================================================

// Function to save user settings to chrome.storage
function saveSettings() {
    // Save userSettings to chrome.storage.local
    chrome.storage.local.set({'userSettings': userSettings}, function() {
        console.log('User settings saved:', userSettings);
    });
}

// Function to load user settings from chrome.storage
function loadSettings(callback) {
    // Retrieve userSettings from chrome.storage.local
    chrome.storage.local.get('userSettings', function(data) {
        userSettings = data.userSettings;
        console.log('User settings loaded:', userSettings);
        // Call the callback function with the loaded user settings
        callback();
    });
}

function loadedSettings() {
    console.log("Settings loaded.");

    if (userSettings === undefined)
        userSettings = {
            "username": "uname",
            "id": 492,
            "keywords": []
        };
}

// ================================ Tweet handlings ================================================================================

// Function to recursively search for nodes with data-testid="tweetText" attribute
function findTweetTextNode(node) {
    // Check if the node has the data-testid attribute set to "tweetText"
    if (node && node.getAttribute && node.getAttribute('data-testid') === 'cellInnerDiv') {
        return node;
    }

    // If the node has children, recursively search for the attribute in its children
    if (node && node.childNodes && node.childNodes.length > 0) {
        for (let i = 0; i < node.childNodes.length; i++) {
            const foundNode = findTweetTextNode(node.childNodes[i]);
            if (foundNode) {
                return foundNode;
            }
        }
    }

    // If not found, return null
    return null;
}

// Finds text element from node and changes visibility.
function handleNode(node) {
    const tweetTextElement = node.querySelector('[data-testid="tweetText"]');

    if (tweetTextElement) {
        // Retrieve the text content of the element
        const tweetText = tweetTextElement.textContent.toLowerCase();  // Convert text to lower case here
        //console.log(tweetText);

        // Check each keyword in kw_filters
        const isBlocked = kw_filters.some(keyword => tweetText.includes(keyword.toLowerCase()));  // Use includes() and convert keyword to lower case

        if (isBlocked) {
            console.log("Blocked");
            // If any keyword is found, mute the tweet by hiding it
            node.style.display = 'none';
        }
        else
            node.style.display = 'true';
    } else {
        console.log("Tweet text element not found.");
    }
    chrome.storage.local.set({"filters": kw_filters}).then(() => {
        console.log("Filter list is set");
    });
    //console.log(tweetTextNode); // Log tweet text
}

// Re-evaluates all nodes according to up-to-date keywords.
function handleNodes() {
    nodes.forEach(node => {
        handleNode(node);
    });
}

// Finds the node from tweet and handle that new tweet.
function handleTweet(tweet) {
    const node = findTweetTextNode(tweet);
    if (node) {
        nodes.push(node);
        handleNode(tweet);
    }
}

// Handles given tweets.
function handleTweets(tweets) {
    tweets.forEach(tweet => {
        handleTweet(tweet);
    });
}

// Extracts new tweets from DOM.
function handleNewTweets(mutationsList) {
    mutationsList.forEach(mutation => {
        if (mutation.type === 'childList') {
            // Check if the mutation added new tweets
            const newTweets = mutation.addedNodes;
            handleTweets(newTweets);
        }
    });
}

// Keeps last 100 loaded tweets.
function trimNodes() {
    setInterval(() => {
        nodes = nodes.slice(-100);
    }, 1000);
}

// WTF is this
function printDataTestIds(node, hierarchy = 'root') {
    // Check if the node exists and has attributes
    if (node && node.nodeType === Node.ELEMENT_NODE && node.attributes) {
        // Loop through attributes of the node
        for (let i = 0; i < node.attributes.length; i++) {
            const attribute = node.attributes[i];
            // Check if the attribute is data-testid
            if (attribute.nodeName === 'data-testid') {
                // Print the hierarchy along with the value of data-testid attribute
                console.log(`${hierarchy}: ${attribute.nodeValue}`);
            }
        }
    }

    // Recursively search child nodes
    if (node && node.childNodes && node.childNodes.length > 0) {
        for (let i = 0; i < node.childNodes.length; i++) {
            const childHierarchy = `${hierarchy}-${i}`;
            printDataTestIds(node.childNodes[i], childHierarchy);
        }
    }
}

// ================================ Main ================================================================================

// Starts everything when the tab loads.
function newTabLoaded() {
    // Options for the MutationObserver
    const observerConfig = {
        childList: true, // Observe changes to the children of the target node
        subtree: true,   // Observe changes in the entire subtree of the target node
    };

    // Select the node that contains the tweets
    targetNode = document.querySelector('[data-testid="primaryColumn"]'); // Adjust the selector as needed

    // Create a new MutationObserver
    observer = new MutationObserver(handleNewTweets);

    if (targetNode && observer )
    // Start observing the target node for mutations
        observer.observe(targetNode, observerConfig);
}

// Listens for new tab loading.
chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type } = obj;
    if (type === "NEW")
        newTabLoaded();
});

// Listens for new keyword message from the background script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type === "KWs" && message.keywords) {
        console.log("Received keywordsList in content script:", message.keywords);
        // Do something with the keywords list here
        // For example, you might want to store it, manipulate it, or display it on the page
        // add message.keywords to kw_filters, give me under this line as a code, join the lists
        kw_filters = kw_filters.concat(message.keywords);
        handleNodes();
        sendResponse({status: "Keywords received by content script"});
        return true;
    }
});

trimNodes();

loadSettings(loadedSettings);  // Initial call to fetch settings

/* ================================ Graveyard ================================================================================================

function getDate() {
    const currentDate = new Date();

    // Get the day of the week (0-6)
    const dayOfWeek = currentDate.getDay();

    // Convert Sunday to 7 to match the desired output
    const adjustedDayOfWeek = (dayOfWeek === 0) ? 7 : dayOfWeek;

    // Get the hour of the day (0-23)
    const hourOfDay = currentDate.getHours();

    return {
        day: adjustedDayOfWeek,
        hour: hourOfDay
    };
}

function triS(a, b, c) {
    return a <= b && b <= c;
}


*/