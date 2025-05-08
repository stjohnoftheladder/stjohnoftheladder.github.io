//----- UI UPDATE LOOP REMOVED -----
// Updates are now triggered directly by Construct 2 events via Browser plugin

// --- HIDE CONSTRUCT UI ELEMS REMOVED ---
// C2 elements used for input should be visible in C2 editor.
// C2 elements used for display should be invisible in C2 editor.


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

// --- Chat display function - Triggered by C2 via Browser.ExecuteJavaScript ---
window.c2_receivedChatUpdate = function() {
    // console.log("c2_receivedChatUpdate called"); // Optional log for debugging
    let logsObject = getMessageLogsFromRuntime(); // Read C2 array when told to
    if (!logsObject || !logsObject.arr) {
        console.warn("c2_receivedChatUpdate: LogMessages array (UID 29) not found or invalid.");
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
    // Formats the C2 array data into HTML for display
    let html = "";
    for (let i = 0; i < logs.length; i++){
        // Basic validation of log entry structure
        if (!logs[i] || !logs[i][0] || typeof logs[i][0][0] === 'undefined') {
            console.warn("Invalid chat log entry structure at index:", i, logs[i]);
            continue;
        }
        html+="\n"
        let message = String(logs[i][0][0]);
        let klass = "message ";
        // Basic detection of player vs system messages based on format
        // Updated regex to allow spaces in usernames
        if( message.match(/^<[\w\s]+> /g)){
            message = message.replace(/</g, "&lt;").replace(/>/g, "&gt;"); // Basic HTML sanitization
            klass += "player-chat ";
            html += `<div class="`+klass+`">`+message+`</div>`;
            continue;
        }
        if( message.match(/err/i) ){ // Simple error detection
            klass += "system-err ";
            message = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            html += `<div class="`+klass+`">`+message+`</div>`;
            continue;
        }
        else{ // Default system message style
            message = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            html += `<div class="`+klass+`">`+message+`</div>`;
            continue;
        }
    }
    return html;
}

// Reads the C2 LogMessages array - called only by c2_receivedChatUpdate
function getMessageLogsFromRuntime(){
    // Accesses the C2 runtime to get the array object by its UID (29)
    // Includes basic error handling and default return value
    try {
        const c2Runtime = cr_getC2Runtime();
        if (!c2Runtime) {
             console.error("getMessageLogsFromRuntime: C2 Runtime not available.");
             return { arr: [] };
        }
        const msgLogObj = c2Runtime.getObjectByUID(29); //MessageLogs array UID is 29
        // Ensure the object exists and has the expected 'arr' property which is an array
        return msgLogObj && Array.isArray(msgLogObj.arr) ? msgLogObj : { arr: [] };
    } catch (e) {
        console.error("Error getting LogMessages (UID 29) from C2 runtime:", e);
        return { arr: [] }; // Fallback on error
    }
}


//  ----30 TEXT HANDLING ----- (Triggered by C2) ----
window.c2_receivedStepsUpdate = function() {
    // console.log("c2_receivedStepsUpdate called"); // Optional log for debugging
    let text = get30TextFromRuntime(); // Read C2 text object when told to
    $("#steps").text( text ); // Update HTML display

    // Update progress bar based on the text (extracts number before '%')
    // Updated regex to handle potential decimals and ensure % sign
    let progressMatch = text.match(/(\d+(\.\d+)?)\s*%/);
    let progressValue = progressMatch ? parseFloat(progressMatch[1]) : 0; // Use group 1 for the number
    let progressPercent = progressValue / 30; // Assuming 30 steps is 100%
    updateGameProgressBar(progressPercent);
}

// Reads the C2 Steps text object - called only by c2_receivedStepsUpdate
function get30TextFromRuntime(){
    // Accesses the C2 runtime to get the text object by its UID (21)
    // Includes basic error handling and default return value
    try {
        const c2Runtime = cr_getC2Runtime();
         if (!c2Runtime) {
             console.error("get30TextFromRuntime: C2 Runtime not available.");
             return "";
        }
        const textObj = c2Runtime.getObjectByUID(21); // Steps Text UID
        return textObj ? textObj.text : ""; // Return empty string if object not found
    } catch (e) {
        console.error("Error getting Steps Text (UID 21) from C2 runtime:", e);
        return ""; // Fallback on error
    }
}

// --- Progress Bar Update --- (Unchanged)
function updateGameProgressBar(percent){
    percent = Math.max(0, Math.min(1, percent)) * 100; // Clamp between 0 and 100
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

