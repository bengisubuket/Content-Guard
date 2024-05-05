var nodes = [];
var targetNode = null;
var observer = null;

var userSettings;
var kw_filters = [];
var category_filters = [];
var count_blocked_kw = 0;
var count_blocked_category = 0;
var closedTime;

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

const requestQueue = [];
let activeRequests = 0;
const maxActiveRequests = 5;

function handleNode(node) {
    const tweetTextElement = node.querySelector('[data-testid="tweetText"]');
    if (!tweetTextElement) {
        console.log("Tweet text element not found.");
        return;
    }

    // Retrieve and process the tweet text
    const tweetText = tweetTextElement.textContent.toLowerCase();
    const kw = kw_filters.find(keyword => tweetText.includes(keyword.toLowerCase()));

    // If a keyword block is found, block immediately and do not make the category check
    if (kw) {
        console.log("BLOCKED_kw: ", kw);
        node.style.display = 'none';
        count_blocked_kw++;
    } else {
        // If no keyword block, enqueue for category checking
        enqueueTweetProcessing(node, tweetText);
    }
}

function enqueueTweetProcessing(node, tweetText) {
    requestQueue.push(() => processTweet(node, tweetText));

    // Try to process the next item in the queue
    processNextInQueue();
}

function processNextInQueue() {
    if (activeRequests < maxActiveRequests && requestQueue.length > 0) {
        const processTweet = requestQueue.shift();
        activeRequests++;
        processTweet();
    }
}

function processTweet(node, tweetText) {
    const userId = 492;
    const tabId = 79782103;

    fetch('http://localhost:8000/api/tweet/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({userId, tabId, tweetText})
    })
    .then(response => response.json())
    .then(data => {
        if (category_filters.includes(data.category)) {
            console.log("BLOCKED_cgtry");
            node.style.display = 'none';
            count_blocked_category++;
        } else {
            // If not blocked by category, revert to visible only if keywords also did not block it
            node.style.removeProperty('display');
        }
        activeRequests--;
        processNextInQueue();
    })
    .catch(error => {
        console.error("Failed to send data:", error);
        activeRequests--;
        processNextInQueue();
    });
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
        // push only the unique nodes
        if (!nodes.includes(node)){
            nodes.push(node);
            handleNode(node);
        }
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


// // ================================ Timers ==============================================================================
// // check if the day has changed after the last tab/window close action
// function isNewDay(closedTime){
//     const day = 86400000; // 24 hours in milliseconds
//     if(Date.now()/day - closedTime/day <= 1){
//         return true;
//     }
//     return false;
// }

// function closedTabWindow(){
//     closedTime = Date.now();
//     // push the closed time, active keywords to the chrome storage
// }

// chrome.tabs.onRemoved.addListener(function(tabid, removed) {
//     closedTabWindow();
//    })
   
// chrome.windows.onRemoved.addListener(function(windowid) {
//     closedTabWindow();
//    })

// function startTimer(keyword, action, duration){

// }

// ================================ Main ================================================================================

// Starts everything when the tab loads.
function newTabLoaded() {
    trimNodes();
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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "filters") {
        // Handle the incoming keywords and categories
        console.log("Received keywords:", message.activeKeywords);
        console.log("Received categories:", message.activeCategories);

        // Update the content script's local settings or perform other actions
        kw_filters = message.activeKeywords;
        category_filters = message.activeCategories;
        handleNodes();
    }
});

/* ================================ Graveyard ================================================================================================

X_X

DAED ZONE 

*/