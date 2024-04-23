var nodes = [];
var targetNode = null;
var observer = null;
var kw_filters = [];

// Function to handle the fetched settings
function handleSettings(settings) {
    console.log("Settings:");
    console.log(settings);
    var kw_blocker_obj = settings.keywords;
    for (let i = 0; i < kw_blocker_obj.length; i++) {
        kw_filters.push(kw_blocker_obj[i].keyword);
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
function handleNewTweets(mutationsList) {
    mutationsList.forEach(mutation => {
        if (mutation.type === 'childList') {
            // Check if the mutation added new tweets
            const newTweets = mutation.addedNodes;
            newTweets.forEach(node => {
                // Recursively search for the tweet text node
                const tweetTextNode = findTweetTextNode(node);
                if (tweetTextNode) {
                    // Access the tweet text
                    nodes.push(tweetTextNode);
                    console.log(nodes);

                    const tweetTextElement = tweetTextNode.querySelector('[data-testid="tweetText"]');

                    if (tweetTextElement) {
                        // Retrieve the text content of the element
                        const tweetText = tweetTextElement.textContent.toLowerCase();  // Convert text to lower case here
                        //console.log(tweetText);

                        // Check each keyword in kw_filters
                        let isBlocked = kw_filters.some(keyword => tweetText.includes(keyword.toLowerCase()));  // Use includes() and convert keyword to lower case

                        if (isBlocked) {
                            console.log("Blocked");
                            // If any keyword is found, mute the tweet by hiding it
                            node.style.display = 'none';
                        }
                    } else {
                        console.log("Tweet text element not found.");
                    }
                    chrome.storage.local.set({"filters": kw_filters}).then(() => {
                        console.log("Filter list is set");
                    });
                    //console.log(tweetTextNode); // Log tweet text
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