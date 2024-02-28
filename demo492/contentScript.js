(() => {
    console.log("auuuuuuu");
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        console.log("contentScript.js listener");
        const { type } = obj;
        if(type === "NEW"){
            console.log("NEW!!!! YIPPIE");
            newTabLoaded();
        }
    });
    const newTabLoaded = () => {
        console.log("newTabLoaded function works");
        document.body.firstChild.after("<p1>TROLOLOLOL</p1>")
    };
})();