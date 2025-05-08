//----- UI UPDATE LOOP REMOVED -----
/*
function UpdateUI(){ ... }
function GameLoop() { ... }
// requestAnimationFrame(GameLoop);
*/

// --- HIDE CONSTRUCT UI ELEMS ---
/* <<< This function remains unused
function hideConstructUI(){ ... }
*/


//----- CHAT FUNCTIONS ----- (Receiving Triggered by C2, Sending via C2 Elements) -----

/* --- Sending functions REMOVED - Handled by C2 TextBox/Button ---
function sendMessage(){ ... }
// $("#chat-input").on("keydown",sendMessageOnEnter);
function sendMessageOnEnter(e){ ... }
*/

// --- getUsername is likely no longer needed by this script ---
/*
function getUsername(){
    try {
        const usernameVar = cr_getC2Runtime().all_global_vars.find( (e) => e.name=="Username");
        return usernameVar ? usernameVar.data : "Guest";
    } catch (e) {
        console.error("Error getting username from C2 runtime:", e);
        return "Guest";
    }
}
*/

// --- Chat display function - Triggered by C2 ---
window.c2_receivedChatUpdate = function() {
    // console.log("c2_receivedChatUpdate called"); // Optional log for debugging
    let logsObject = getMessageLogsFromRuntime(); // Read C2 array when told to
    if (!logsObject || !logsObject.arr) {
        console.warn("c2_receivedChatUpdate: LogMessages array not found or invalid.");
        return;
    }

    toggleMessageNotification("on"); // Show notification if window is hidden
    let html = formatMessageLogsToHTML(logsObject.arr); // Generate HTML
    $("#chat").html(html); // Update the HTML display

    // Auto-scroll to bottom
    var chatArea = document.getElementById('chat');
    if (chatArea) {
        // Scroll down only if the user isn't scrolled up to read history
        const isScrolledToBottom = chatArea.scrollHeight - chatArea.clientHeight <= chatArea.scrollTop + 20;
        if(isScrolledToBottom) {
             chatArea.scrollTop = chatArea.scrollHeight;
        }
    }
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

// Reads the C2 LogMessages array - called only by c2_receivedChatUpdate
function getMessageLogsFromRuntime(){
    try {
        const msgLogObj = cr_getC2Runtime().getObjectByUID(29); //MessageLogs array UID is 29
        // Return a default empty structure if not found or invalid
        return msgLogObj && Array.isArray(msgLogObj.arr) ? msgLogObj : { arr: [] };
    } catch (e) {
        console.error("Error getting LogMessages from C2 runtime:", e);
        return { arr: [] }; // Fallback on error
    }
}

// --- Flag functions REMOVED ---


//  ----30 TEXT HANDLING ----- (Triggered by C2) ----
window.c2_receivedStepsUpdate = function() {
    // console.log("c2_receivedStepsUpdate called"); // Optional log for debugging
    let text = get30TextFromRuntime(); // Read C2 text object when told to
    $("#steps").text( text ); // Update HTML display

    // Update progress bar based on the text
    let progressMatch = text.match(/(\d+(\.\d+)?)\s*%/g);
    let progressValue = progressMatch ? parseFloat(progressMatch[0]) : 0;
    let progressPercent = progressValue / 30; // Assuming 30 is max value
    updateGameProgressBar(progressPercent);
}

// Reads the C2 Steps text object - called only by c2_receivedStepsUpdate
function get30TextFromRuntime(){
    try {
        const textObj = cr_getC2Runtime().getObjectByUID(21); // Steps Text UID
        return textObj ? textObj.text : ""; // Return empty string if object not found
    } catch (e) {
        console.error("Error getting Steps Text from C2 runtime:", e);
        return ""; // Fallback on error
    }
}

// --- Progress Bar Update --- (Unchanged)
function updateGameProgressBar(percent){
    percent = Math.max(0, Math.min(1, percent)) * 100;
    let progress_gradient = "linear-gradient( 0deg, var(--red-accent) "+percent+"%, #9999 "+percent+"%)";
    $("#game-progress-bar").css("background", progress_gradient);
}

//---- HANDLE RESIZING ----- (Unchanged)
function placeUI(){ $("#UI").css( "width", $("#c2canvas").css("width") ); $("#UI").css( "height", $("#c2canvas").css("height") ); }
setTimeout(placeUI, 300); setTimeout(placeUI, 1000); setTimeout(placeUI, 5000);
addEventListener('resize', ()=>{ setTimeout(placeUI, 50) })

//---- UI TOGGLES ------- (Unchanged)
function toggleDisplay(itemId){ if( $(itemId).css("visibility") === "hidden"){ $(itemId).css({"visibility":"", "height":"", "opacity":"", "position":""}); return; } else { $(itemId).css({"visibility":"hidden", "height":"0px", "opacity":"0", "position":"absolute"}); return; } }
function toggleSplash(){ toggleDisplay(".login-page"); }
function toggleMenu(){ toggleDisplay("#play-menu"); }
function toggleMessageNotification(state){ if( state == "on" && ($("#chat-window").css("visibility") == "hidden") ){ $("#chat-window-toggle").addClass("red-bg"); return; } if(state == "off" || ($("#chat-window").css("visibility") != "hidden")){ $("#chat-window-toggle").removeClass("red-bg"); return; } }
function toggleChat(){ toggleDisplay("#chat-window"); if ($("#chat-window").css("visibility") != "hidden") { toggleMessageNotification("off"); } }
function toggleSteps(){ toggleDisplay("#steps-window"); }

// --- Keep initial toggles ---
toggleMenu();
toggleChat();

function toggleValueOnOff(itemId){ if ($(itemId).attr("value") == "on"){ $(itemId).attr("value", "off"); return "off"; } if ($(itemId).attr("value") == "off"){ $(itemId).attr("value", "on"); return "on"; } }
async function toggleAudio(){ let value = toggleValueOnOff("#menu-mute"); $("#audio-state").text(value); }

