//----- UI UPDATE LOOP ------

function UpdateUI(){
    display30Text();
    displayMessages();      // <<< RE-ENABLED chat display update
    // hideConstructUI();   // <<< KEPT COMMENTED OUT: Do not hide C2 elements
}

// Keep setInterval for UI updates
setInterval(UpdateUI, 250);

// --- HIDE CONSTRUCT UI ELEMS ---
/* <<< This function remains unused
function hideConstructUI(){
    // ... function body ...
}
*/


//----- CHAT FUNCTIONS ----- (RE-ENABLED & IMPROVED) -----

function sendMessage(){
    // <<< RE-ENABLED sending via HTML UI >>>
    let chatContent = $("#chat-input").val();
    if (!chatContent || chatContent.trim() === "") return; // Don't send empty messages

    let username =  getUsername();
    // Call the C2 function to handle adding the chat locally and sending via Multiplayer
    c2_callFunction( "addChat", [username, chatContent]);
    // displayMessages(); // No longer needed here, UpdateUI handles it
    $("#chat-input").val(""); // Clear input after sending
}

// <<< RE-ENABLED Enter key registration for HTML input >>>
$("#chat-input").on("keydown",sendMessageOnEnter);

// <<< RE-ENABLED Function definition for Enter key >>>
function sendMessageOnEnter(e){
    if (e.code == "Enter"){
        sendMessage();
    }
}

// --- getUsername might be used elsewhere, so it's kept ---
function getUsername(){
    // Use try-catch for safety when accessing runtime internals
    try {
        const usernameVar = cr_getC2Runtime().all_global_vars.find( (e) => e.name=="Username");
        return usernameVar ? usernameVar.data : "Guest"; // Provide a default
    } catch (e) {
        console.error("Error getting username from C2 runtime:", e);
        return "Guest"; // Fallback username
    }
}

// --- Chat display functions RE-ENABLED with improvements ---

// Keep track of the last raw log data stringified
var lastLogDataString = "";

function displayMessages(){
    let logsObject = getMessageLogsFromRuntime(); // Get the C2 array object
    // Basic check to ensure the object and its array property exist
    if (!logsObject || !logsObject.arr) {
        // console.warn("LogMessages array not found or invalid."); // Optional warning
        return;
    }

    let currentLogDataString = "";
    try {
        // Use JSON.stringify for a relatively robust comparison of array content
        currentLogDataString = JSON.stringify(logsObject.arr);
    } catch (e) {
        console.error("Error stringifying chat log data:", e);
        return; // Avoid proceeding if data can't be processed
    }


    // Compare stringified array data instead of generated HTML
    if( lastLogDataString === currentLogDataString ){
        return 0; // No change in data, do nothing
    }

    // Data has changed, update the display
    // console.log("Chat data changed, updating display."); // Optional log
    toggleMessageNotification("on");
    lastLogDataString = currentLogDataString; // Store the new data state
    let html = formatMessageLogsToHTML(logsObject.arr); // Generate HTML from the array
    $("#chat").html(html);

    // Auto-scroll to bottom
    var chatArea = document.getElementById('chat');
    if (chatArea) {
        // Scroll down only if the user isn't scrolled up to read history
        // Check if scrolled near the bottom (e.g., within 20 pixels)
        const isScrolledToBottom = chatArea.scrollHeight - chatArea.clientHeight <= chatArea.scrollTop + 20;
        if(isScrolledToBottom) {
             chatArea.scrollTop = chatArea.scrollHeight;
        }
    } else {
        // console.warn("Chat area element not found for scrolling."); // Optional warning
    }
}

function formatMessageLogsToHTML(logs){
    let html = ""; //stores html for message log
    for (let i = 0; i < logs.length; i++){
        // Check if the log entry structure is as expected
        if (!logs[i] || !logs[i][0] || typeof logs[i][0][0] === 'undefined') {
            // console.warn("Invalid log entry structure at index:", i, logs[i]); // Optional warning
            continue; // Skip this invalid entry
        }

        html+="\n"
        let message = logs[i][0][0];
        // Ensure message is a string before applying regex or replacements
        message = String(message);

        let klass = "message ";
        if( message.match(/^<[\w\s]+> /g)){ // Updated regex to allow spaces in usernames
            // Sanitize HTML before inserting (basic example)
            message = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            klass += "player-chat ";
            html += `<div class="`+klass+`">`+message+`</div>`;
            continue;
        }
        if( message.match(/err/i) ){ //checks for "err" hopefully catching "error" at the same time
            klass += "system-err ";
            // Sanitize system messages too
            message = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            html += `<div class="`+klass+`">`+message+`</div>`;
            continue;
        }
        else{
             // Sanitize generic messages
            message = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            html += `<div class="`+klass+`">`+message+`</div>`;
            continue;
        }
    }
    return html;
}

// HACKY - Kept as is, but direct access can be fragile.
function getMessageLogsFromRuntime(){
    try {
        // Ensure the object exists before trying to access properties
        const msgLogObj = cr_getC2Runtime().getObjectByUID(29); //MessageLogs array UID is 29
        return msgLogObj ? msgLogObj : { arr: [] }; // Return an empty structure if not found
    } catch (e) {
        console.error("Error getting LogMessages from C2 runtime:", e);
        return { arr: [] }; // Fallback to empty structure on error
    }
}

//  ----30 TEXT HANDLING --------- (Unchanged)

function display30Text(){
    let text = get30TextFromRuntime();
    $("#steps").text( text );
    // Use parseFloat for potentially non-integer percentages, provide default
    let progressMatch = text.match(/(\d+(\.\d+)?)\s*%/g); // Match number possibly with decimal, followed by %
    let progressValue = progressMatch ? parseFloat(progressMatch[0]) : 0;
    let progressPercent = progressValue / 30; // Assuming 30 is the max value for 100%
    updateGameProgressBar(progressPercent);
}


function get30TextFromRuntime(){
    try {
        const textObj = cr_getC2Runtime().getObjectByUID(21); // 30Text UID
        return textObj ? textObj.text : ""; // Return empty string if object not found
    } catch (e) {
        console.error("Error getting 30Text from C2 runtime:", e);
        return ""; // Fallback on error
    }
}


//---- HANDLE RESIZING ----- (Unchanged)

function placeUI(){
    $("#UI").css( "width", $("#c2canvas").css("width") );
    $("#UI").css( "height", $("#c2canvas").css("height") );
}
setTimeout(placeUI, 300);//gives time for UI to load
setTimeout(placeUI, 1000); //try again for slow connection
setTimeout(placeUI, 5000); //try again for really slow connection
addEventListener('resize', ()=>{
    setTimeout(placeUI, 50)
})

//---- UI TOGGLES ------- (Unchanged, but toggleChat is now relevant again)

function toggleDisplay(itemId){

    if( $(itemId).css("visibility") === "hidden"){
        $(itemId).css("visibility", "");
        $(itemId).css("height", "");
        $(itemId).css("opacity", "");
        $(itemId).css("position", ""); //empty string restores imported styling
        return;
    }
    else{
        $(itemId).css("visibility", "hidden");
        $(itemId).css("height", "0px"); //keep hidden elements from taking up space in flex containers
        $(itemId).css("opacity", "100"); // Assuming this should be 0 for hidden? Check CSS.
        $(itemId).css("position", "absolute");
        return;
    }
}

function toggleSplash(){
    toggleDisplay(".login-page");
}
function toggleMenu(){
    toggleDisplay("#play-menu");
}

function toggleMessageNotification(state){
    // Turn on notification only if chat window is actually hidden
    if(
        state == "on" &&
        ($("#chat-window").css("visibility") == "hidden")
    ){
        $("#chat-window-toggle").addClass("red-bg");
        return;
    }
    // Turn off notification unconditionally when asked, or if window becomes visible
    if(state == "off" || ($("#chat-window").css("visibility") != "hidden")){
        $("#chat-window-toggle").removeClass("red-bg");
        return;
    }
}

function toggleChat(){
    toggleDisplay("#chat-window");
    // If window is now visible, turn off notification
    if ($("#chat-window").css("visibility") != "hidden") {
        toggleMessageNotification("off");
    }
}

function toggleSteps(){
    toggleDisplay("#steps-window");
}

// --- Hide menu and chat initially ---
toggleMenu();
toggleChat(); // <<< RE-ENABLED initial toggle for chat window

function toggleValueOnOff(itemId){
    if ($(itemId).attr("value") == "on"){
        $(itemId).attr("value", "off");
        return "off";
    }
    if ($(itemId).attr("value") == "off"){
        $(itemId).attr("value", "on");
        return "on";
    }
}
async function toggleAudio(){
    let value = toggleValueOnOff("#menu-mute");
    $("#audio-state").text(value);
}

// --- Progress Bar Update --- (Unchanged)
function updateGameProgressBar(percent){
    // Ensure percent is between 0 and 1
    percent = Math.max(0, Math.min(1, percent)) * 100;
    let progress_gradient = "linear-gradient( 0deg, var(--red-accent) "+percent+"%, #9999 "+percent+"%)";
    $("#game-progress-bar").css("background", progress_gradient);
}
