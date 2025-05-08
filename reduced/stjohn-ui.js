//----- UI UPDATE LOOP ------

function UpdateUI(){
    // Check flags and update corresponding UI elements if needed
    display30Text();
    displayMessages();
    // hideConstructUI();   // <<< KEPT COMMENTED OUT
}

// --- Game Loop using requestAnimationFrame ---
function GameLoop() {
    // Execute the UI update logic
    UpdateUI();
    // Request the next frame
    requestAnimationFrame(GameLoop);
}

// Start the loop
requestAnimationFrame(GameLoop);
// setInterval(UpdateUI, 100); // <<< REMOVED setInterval

// --- HIDE CONSTRUCT UI ELEMS ---
/* <<< This function remains unused
function hideConstructUI(){
    // ... function body ...
}
*/


//----- CHAT FUNCTIONS ----- (Flag-based Update Logic) -----

function sendMessage(){
    // Sending via HTML UI remains the same
    let chatContent = $("#chat-input").val();
    if (!chatContent || chatContent.trim() === "") return;

    let username =  getUsername();
    c2_callFunction( "addChat", [username, chatContent]);
    $("#chat-input").val("");
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

// --- Chat display function checks flag BEFORE reading data ---
function displayMessages(){
    let updateFlag = getChatUpdateFlagFromRuntime();

    // Only proceed if the flag is set by C2
    if (updateFlag !== 1) {
        return; // No update needed
    }

    // Flag is 1. Reset it immediately in C2.
    resetChatUpdateFlagInRuntime();

    // Now get logs and update display.
    let logsObject = getMessageLogsFromRuntime();
    if (!logsObject || !logsObject.arr) {
        return;
    }

    toggleMessageNotification("on");
    let html = formatMessageLogsToHTML(logsObject.arr);
    $("#chat").html(html);

    // Auto-scroll to bottom
    var chatArea = document.getElementById('chat');
    if (chatArea) {
        const isScrolledToBottom = chatArea.scrollHeight - chatArea.clientHeight <= chatArea.scrollTop + 20;
        if(isScrolledToBottom) {
             chatArea.scrollTop = chatArea.scrollHeight;
        }
    }
}

function formatMessageLogsToHTML(logs){
    // (This function remains the same)
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

function getMessageLogsFromRuntime(){
    // (This function remains the same, still potentially fragile but called less often)
    try {
        const msgLogObj = cr_getC2Runtime().getObjectByUID(29);
        return msgLogObj ? msgLogObj : { arr: [] };
    } catch (e) {
        console.error("Error getting LogMessages from C2 runtime:", e);
        return { arr: [] };
    }
}

// --- Functions to interact with the C2 chat flag (Unchanged) ---
function getChatUpdateFlagFromRuntime() {
    try {
        const flagVar = cr_getC2Runtime().all_global_vars.find( (e) => e.name=="ChatLogUpdated");
        return flagVar ? flagVar.data : 0;
    } catch (e) {
        console.error("Error getting ChatLogUpdated flag from C2 runtime:", e);
        return 0;
    }
}

function resetChatUpdateFlagInRuntime() {
    try {
        c2_callFunction("ResetChatFlag");
    } catch (e) {
        console.error("Error calling C2 function ResetChatFlag:", e);
    }
}


//  ----30 TEXT HANDLING ----- (Revised to use flag) ----

function display30Text(){
    let updateFlag = getStepsUpdateFlagFromRuntime();

    // Only proceed if the flag is set by C2
    if (updateFlag !== 1) {
        return; // No update needed
    }

    // Flag is 1. Reset it immediately in C2.
    resetStepsUpdateFlagInRuntime();

    // Now get text and update display.
    let text = get30TextFromRuntime();
    $("#steps").text( text );
    let progressMatch = text.match(/(\d+(\.\d+)?)\s*%/g);
    let progressValue = progressMatch ? parseFloat(progressMatch[0]) : 0;
    let progressPercent = progressValue / 30;
    updateGameProgressBar(progressPercent);
}

function get30TextFromRuntime(){
    // (This function remains the same, but is now called only when flag is set)
    try {
        const textObj = cr_getC2Runtime().getObjectByUID(21);
        return textObj ? textObj.text : "";
    } catch (e) {
        console.error("Error getting 30Text from C2 runtime:", e);
        return "";
    }
}

// --- NEW Functions to interact with the C2 steps flag ---
function getStepsUpdateFlagFromRuntime() {
    try {
        const flagVar = cr_getC2Runtime().all_global_vars.find( (e) => e.name=="StepsUpdated");
        return flagVar ? flagVar.data : 0; // Default to 0 if not found
    } catch (e) {
        console.error("Error getting StepsUpdated flag from C2 runtime:", e);
        return 0; // Fallback on error
    }
}

function resetStepsUpdateFlagInRuntime() {
    try {
        c2_callFunction("ResetStepsFlag");
    } catch (e) {
        console.error("Error calling C2 function ResetStepsFlag:", e);
    }
}

// --- Progress Bar Update --- (Unchanged)
function updateGameProgressBar(percent){
    percent = Math.max(0, Math.min(1, percent)) * 100;
    let progress_gradient = "linear-gradient( 0deg, var(--red-accent) "+percent+"%, #9999 "+percent+"%)";
    $("#game-progress-bar").css("background", progress_gradient);
}

//---- HANDLE RESIZING ----- (Unchanged)
// ... (rest of the resizing functions) ...
function placeUI(){ $("#UI").css( "width", $("#c2canvas").css("width") ); $("#UI").css( "height", $("#c2canvas").css("height") ); }
setTimeout(placeUI, 300); setTimeout(placeUI, 1000); setTimeout(placeUI, 5000);
addEventListener('resize', ()=>{ setTimeout(placeUI, 50) })

//---- UI TOGGLES ------- (Unchanged)
// ... (rest of the toggle functions) ...
function toggleDisplay(itemId){ if( $(itemId).css("visibility") === "hidden"){ $(itemId).css({"visibility":"", "height":"", "opacity":"", "position":""}); return; } else { $(itemId).css({"visibility":"hidden", "height":"0px", "opacity":"0", "position":"absolute"}); return; } }
function toggleSplash(){ toggleDisplay(".login-page"); }
function toggleMenu(){ toggleDisplay("#play-menu"); }
function toggleMessageNotification(state){ if( state == "on" && ($("#chat-window").css("visibility") == "hidden") ){ $("#chat-window-toggle").addClass("red-bg"); return; } if(state == "off" || ($("#chat-window").css("visibility") != "hidden")){ $("#chat-window-toggle").removeClass("red-bg"); return; } }
function toggleChat(){ toggleDisplay("#chat-window"); if ($("#chat-window").css("visibility") != "hidden") { toggleMessageNotification("off"); } }
function toggleSteps(){ toggleDisplay("#steps-window"); }
toggleMenu(); toggleChat();
function toggleValueOnOff(itemId){ if ($(itemId).attr("value") == "on"){ $(itemId).attr("value", "off"); return "off"; } if ($(itemId).attr("value") == "off"){ $(itemId).attr("value", "on"); return "on"; } }
async function toggleAudio(){ let value = toggleValueOnOff("#menu-mute"); $("#audio-state").text(value); }

