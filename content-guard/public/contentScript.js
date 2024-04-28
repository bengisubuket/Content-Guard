var nodes = [];
var targetNode = null;
var observer = null;
var kw_filters = [];
var category_filters = [];

// Function to handle the fetched settings
function handleSettings(settings) {
    console.log("Settings:");
    console.log(settings);
    var kw_blocker_obj = settings.keywords;
    for (let i = 0; i < kw_blocker_obj.length; i++) {
        kw_filters.push(kw_blocker_obj[i].keyword);
    }
    var category_blocker_obj = settings.categories;
    for (let i = 0; i < category_blocker_obj.length; i++) {
        category_filters.push(category_blocker_obj[i].category);
    }
}

function fetchSettings(attempt = 1) {
    if (attempt > 1000) {
        console.error('Failed to load settings after 1000 attempts');
        return; // Stop retrying after 1000 attempts
    }

    fetch(chrome.runtime.getURL('userSettings.json'))
        .then((response) => response.json())
        .then((settings) => {
            handleSettings(settings);
        })
        .catch((error) => {
            console.error(`Error loading settings on attempt ${attempt}:`, error);
            fetchSettings(attempt + 1); // Increment attempt count and retry
        });
}

fetchSettings();  // Initial call to fetch settings


// Fetch the settings.json at runtime
fetch(chrome.runtime.getURL('userSettings.json'))
  .then((response) => response.json())
  .then((settings) => {
    handleSettings(settings);
  })
  .catch((error) => {
    console.error('Error loading settings:', error)
  });
  

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

// Function to handle new tweets
var tweetCount = 0; // Initialize a counter for the number of tweets processed

function handleNewTweets(mutationsList) {
    mutationsList.forEach(mutation => {
        if (mutation.type === 'childList') {
            const newTweets = mutation.addedNodes;
            newTweets.forEach(node => {
                const tweetTextNode = findTweetTextNode(node);
                if (tweetTextNode) {
                    const tweetTextElement = tweetTextNode.querySelector('[data-testid="tweetText"]');
                    if (tweetTextElement) {
                        const tweetText = tweetTextElement.textContent.toLowerCase();
                        let isBlocked = kw_filters.some(keyword => tweetText.includes(keyword.toLowerCase()));
                        if (isBlocked) {
                            console.log("Blocked");
                            node.style.display = 'none';
                        }

                        // Only proceed if the tweet hasn't been blocked
                        if (!isBlocked) {
                            tweetCount++; // Increment the counter since this tweet will be sent
                            const userId = 492;
                            const tabId = 79782103;
                            fetch('http://localhost:8000/api/tweet/', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    userId: userId,
                                    tabId: tabId,
                                    tweetText: tweetText,
                                }),
                            }).then(response => response.json()) // parse the JSON from the response
                            .then(data => {
                                console.log("Tweet Text:", tweetText, "Category received:", data.category);
                                // check if the caategory is in the category_filters
                                if (category_filters.includes(data.category)) {
                                    console.log("BLOCKED");
                                    node.style.display = 'none'; // This assumes 'node' is the element containing the tweet
                                }
                                // You can also add logic to handle other categories as needed
                            })
                            .catch(error => {
                                console.error("Failed to send data:", error);
                            });
                        }
                    } else {
                        console.log("Tweet text element not found.");
                    }
                }
            });
        }
    });
}


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

const newTabLoaded = () => {
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
};

console.log("auuuuuuu");
chrome.runtime.onMessage.addListener((obj, sender, response) => {
    console.log("contentScript.js listener");
    const { type } = obj;
    if (type === "NEW") {
        console.log("NEW!!!! YIPPIE");
        newTabLoaded();
    }
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type === "NEW" && message.keywords) {
        console.log("Received keywordsList in content script:", message.keywords);
        // Do something with the keywords list here
        // For example, you might want to store it, manipulate it, or display it on the page
        // add message.keywords to kw_filters, give me under this line as a code, join the lists
        kw_filters = kw_filters.concat(message.keywords);

    }

    // Optionally send a response back to the background script
    sendResponse({status: "Keywords received by content script"});
    return true; // Keep the messaging channel open if you are doing asynchronous processing
});