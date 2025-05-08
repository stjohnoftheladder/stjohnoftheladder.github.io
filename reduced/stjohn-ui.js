//----- UI UPDATE LOOP ------

function UpdateUI(){
    display30Text();
    displayMessages();      // Checks the C2 flag and updates if needed
    // hideConstructUI();   // <<< KEPT COMMENTED OUT: Do not hide C2 elements
}

// Keep setInterval for UI updates (checking the flag)
setInterval(UpdateUI, 100); // Check flag more frequently maybe? Or keep at 250ms.

// --- HIDE CONSTRUCT UI ELEMS ---
/* <<< This function remains unused
function hideConstructUI(){
    // ... function body ...
}
*/


//----- CHAT FUNCTIONS ----- (Flag-based Update Logic - Revised Reset) -----

function sendMessage(){
    // Sending via HTML UI remains the same
    let chatContent = $("#chat-input").val();
    if (!chatContent || chatContent.trim() === "") return; // Don't send empty messages

    let username =  getUsername();
    // Call the C2 function to handle adding the chat locally and sending via Multiplayer
    // This will also trigger setting the ChatLogUpdated flag in C2 via AddLog
    c2_callFunction( "addChat", [username, chatContent]);
    $("#chat-input").val(""); // Clear input after sending
}

// Enter key registration for HTML input remains the same
$("#chat-input").on("keydown",sendMessageOnEnter);

function sendMessageOnEnter(e){
    if (e.code == "Enter"){
        sendMessage();
    }
}

// --- getUsername might be used elsewhere, so it's kept ---
function getUsername(){
    try {
        const usernameVar = cr_getC2Runtime().all_global_vars.find( (e) => e.name=="Username");
        return usernameVar ? usernameVar.data : "Guest";
    } catch (e) {
        console.error("Error getting username from C2 runtime:", e);
        return "Guest";
    }
}

// --- Chat display functions REVISED to reset flag *before* processing ---

function displayMessages(){
    let updateFlag = getChatUpdateFlagFromRuntime();

    // Only update if the flag is set by C2
    if (updateFlag !== 1) {
        return; // No update needed
    }

    // --- MODIFICATION START ---
    // Flag is 1. Reset it *immediately* in C2 before doing anything else.
    // console.log("ChatLogUpdated flag is 1, resetting and updating display."); // Optional log
    resetChatUpdateFlagInRuntime();
    // --- MODIFICATION END ---


    // Now proceed with getting logs and updating display using the data
    // that was present when the flag *was* 1.
    let logsObject = getMessageLogsFromRuntime(); // Get the C2 array object
    if (!logsObject || !logsObject.arr) {
        // console.warn("LogMessages array not found or invalid after flag reset."); // Optional warning
        // Flag was already reset, just exit.
        return;
    }

    toggleMessageNotification("on");
    let html = formatMessageLogsToHTML(logsObject.arr); // Generate HTML from the array
    $("#chat").html(html);

    // Auto-scroll to bottom
    var chatArea = document.getElementById('chat');
    if (chatArea) {
        const isScrolledToBottom = chatArea.scrollHeight - chatArea.clientHeight <= chatArea.scrollTop + 20;
        if(isScrolledToBottom) {
             chatArea.scrollTop = chatArea.scrollHeight;
        }
    } else {
        // console.warn("Chat area element not found for scrolling."); // Optional warning
    }

    // Flag was already reset at the beginning of the 'if' block.
    // resetChatUpdateFlagInRuntime(); // <<< MOVED TO EARLIER
}

function formatMessageLogsToHTML(logs){
    // (This function remains the same as the previous version)
    let html = "";
    for (let i = 0; i < logs.length; i++){
        if (!logs[i] || !logs[i][0] || typeof logs[i][0][0] === 'undefined') {
            continue;
        }
        html+="\n"
        let message = String(logs[i][0][0]);
        let klass = "message ";
        if( message.match(/^<[\w\s]+> /g)){
            message = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            klass += "player-chat ";
            html += `<div class="`+klass+`">`+message+`</div>`;
            continue;
        }
        if( message.match(/err/i) ){
            klass += "system-err ";
            message = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            html += `<div class="`+klass+`">`+message+`</div>`;
            continue;
        }
        else{
            message = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            html += `<div class="`+klass+`">`+message+`</div>`;
            continue;
        }
    }
    return html;
}

// Function to get the C2 LogMessages array (kept the same, still potentially fragile)
function getMessageLogsFromRuntime(){
    try {
        const msgLogObj = cr_getC2Runtime().getObjectByUID(29); //MessageLogs array UID is 29
        return msgLogObj ? msgLogObj : { arr: [] };
    } catch (e) {
        console.error("Error getting LogMessages from C2 runtime:", e);
        return { arr: [] };
    }
}

// --- Functions to interact with the C2 flag (Unchanged) ---
function getChatUpdateFlagFromRuntime() {
    try {
        const flagVar = cr_getC2Runtime().all_global_vars.find( (e) => e.name=="ChatLogUpdated");
        return flagVar ? flagVar.data : 0; // Default to 0 if not found
    } catch (e) {
        console.error("Error getting ChatLogUpdated flag from C2 runtime:", e);
        return 0; // Fallback on error
    }
}

function resetChatUpdateFlagInRuntime() {
    try {
        c2_callFunction("ResetChatFlag");
    } catch (e) {
        console.error("Error calling C2 function ResetChatFlag:", e);
    }
}


//  ----30 TEXT HANDLING --------- (Unchanged)
// ... (rest of the 30 Text handling functions) ...
function display30Text(){
    let text = get30TextFromRuntime();
    $("#steps").text( text );
    let progressMatch = text.match(/(\d+(\.\d+)?)\s*%/g);
    let progressValue = progressMatch ? parseFloat(progressMatch[0]) : 0;
    let progressPercent = progressValue / 30;
    updateGameProgressBar(progressPercent);
}
function get30TextFromRuntime(){
    try {
        const textObj = cr_getC2Runtime().getObjectByUID(21);
        return textObj ? textObj.text : "";
    } catch (e) {
        console.error("Error getting 30Text from C2 runtime:", e);
        return "";
    }
}
function updateGameProgressBar(percent){
    percent = Math.max(0, Math.min(1, percent)) * 100;
    let progress_gradient = "linear-gradient( 0deg, var(--red-accent) "+percent+"%, #9999 "+percent+"%)";
    $("#game-progress-bar").css("background", progress_gradient);
}

//---- HANDLE RESIZING ----- (Unchanged)
// ... (rest of the resizing functions) ...
function placeUI(){
    $("#UI").css( "width", $("#c2canvas").css("width") );
    $("#UI").css( "height", $("#c2canvas").css("height") );
}
setTimeout(placeUI, 300);
setTimeout(placeUI, 1000);
setTimeout(placeUI, 5000);
addEventListener('resize', ()=>{
    setTimeout(placeUI, 50)
})

//---- UI TOGGLES ------- (Unchanged)
// ... (rest of the toggle functions) ...
function toggleDisplay(itemId){
    if( $(itemId).css("visibility") === "hidden"){
        $(itemId).css("visibility", "");
        $(itemId).css("height", "");
        $(itemId).css("opacity", "");
        $(itemId).css("position", "");
        return;
    }
    else{
        $(itemId).css("visibility", "hidden");
        $(itemId).css("height", "0px");
        $(itemId).css("opacity", "0"); // Changed to 0 for hidden
        $(itemId).css("position", "absolute");
        return;
    }
}
function toggleSplash(){ toggleDisplay(".login-page"); }
function toggleMenu(){ toggleDisplay("#play-menu"); }
function toggleMessageNotification(state){
    if( state == "on" && ($("#chat-window").css("visibility") == "hidden") ){
        $("#chat-window-toggle").addClass("red-bg"); return;
    }
    if(state == "off" || ($("#chat-window").css("visibility") != "hidden")){
        $("#chat-window-toggle").removeClass("red-bg"); return;
    }
}
function toggleChat(){
    toggleDisplay("#chat-window");
    if ($("#chat-window").css("visibility") != "hidden") {
        toggleMessageNotification("off");
    }
}
function toggleSteps(){ toggleDisplay("#steps-window"); }
toggleMenu();
toggleChat();
function toggleValueOnOff(itemId){
    if ($(itemId).attr("value") == "on"){ $(itemId).attr("value", "off"); return "off"; }
    if ($(itemId).attr("value") == "off"){ $(itemId).attr("value", "on"); return "on"; }
}
async function toggleAudio(){
    let value = toggleValueOnOff("#menu-mute");
    $("#audio-state").text(value);
}
