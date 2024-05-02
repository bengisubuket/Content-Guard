var nodes = [];
var targetNode = null;
var observer = null;

filters_obj = null;
kw_filters = [];

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

function fetchSettings(attempt) {
    if (attempt === 50) {
        console.error('Failed to load settings after 1000 attempts');
        return; // Stop retrying after 50 attempts
    }

    fetch(chrome.runtime.getURL('userSettings.json'))
        .then((response) => response.json())
        .then((settings) => {
            filters_obj = settings.keywords;

            for (let kw in filters_obj)
                if (filters_obj[kw].blockTimer.enabled && filters_obj[kw].blockTimer.remainingTime > 0)
                    kw_filters.push(kw);
                else if (filters_obj[kw].scheduler.enabled) {
                    let sch = filters_obj[kw].scheduler;
                    let date = getDate();
                    if (!sch.days.includes(date.day) || !triS(sch.startTime, date.hour, sch.endTime))
                        kw_filters.push(kw);
                }
        })
        .catch((error) => {
            console.error(`Error loading settings on attempt ${attempt}:`, error);
            fetchSettings(attempt + 1); // Increment attempt count and retry
        });
}

function handleSettings() {
    // Start handling tasks asynchronously
    setInterval(() => {
        if (filters_obj)
            for (let kw in filters_obj) {
                if (filters_obj[kw].blockTimer.enabled) {
                    let timer = filters_obj[kw].blockTimer;
                    if (timer.remainingTime > 0)
                        timer.remainingTime -= 1000;
                    else {
                        if (kw_filters.includes(kw))
                            kw_filters.splice(kw_filters.indexOf(kw), 1);
                        filters_obj[kw].blockTimer.enabled = false;
                    }
                }
                else if (filters_obj[kw].allowTimer.enabled) {
                    let timer = filters_obj[kw].allowTimer;
                    if (timer.remainingTime > 0)
                        timer.remainingTime -= 1000;
                    else {
                        if (!kw_filters.includes(kw))
                            kw_filters.push(kw);
                        filters_obj[kw].blockTimer.enabled = false;
                    }
                }
                else if (filters_obj[kw].scheduler.enabled) {
                    // WTF
                }
            }
    }, 1000);
}

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

function handleTweets(tweets) {
    tweets.forEach(node => {
        // Recursively search for the tweet text node
        const tweetTextNode = findTweetTextNode(node);
        if (tweetTextNode) {
            // Access the tweet text
            nodes.push(tweetTextNode);

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

function handleNodes() {
    nodes.forEach(node => {
        const tweetTextElement = node.querySelector('[data-testid="tweetText"]');

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
    });
}

// Function to handle new tweets
function handleNewTweets(mutationsList) {
    mutationsList.forEach(mutation => {
        if (mutation.type === 'childList') {
            // Check if the mutation added new tweets
            const newTweets = mutation.addedNodes;
            handleTweets(newTweets);
        }
    });
}

function trimNodes() {
    setInterval(() => {
        nodes = nodes.slice(-100);
    }, 1000);
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

chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type } = obj;
    if (type === "NEW") {
        newTabLoaded();
    }
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type === "KW" && message.keywords) {
        console.log("Received keywordsList in content script:", message.keywords);
        // Do something with the keywords list here
        // For example, you might want to store it, manipulate it, or display it on the page
        // add message.keywords to kw_filters, give me under this line as a code, join the lists
        kw_filters = kw_filters.concat(message.keywords);
        handleNodes();
    }

    // Optionally send a response back to the background script
    sendResponse({status: "Keywords received by content script"});
    return true; // Keep the messaging channel open if you are doing asynchronous processing
});

trimNodes();

fetchSettings(0);  // Initial call to fetch settings
handleSettings();