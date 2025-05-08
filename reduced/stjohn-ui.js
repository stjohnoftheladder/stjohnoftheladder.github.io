//----- UI UPDATE LOOP REMOVED -----
/*
function UpdateUI(){
    // No longer needed - updates are triggered by C2
}
function GameLoop() {
    // No longer needed
    // requestAnimationFrame(GameLoop);
}
// requestAnimationFrame(GameLoop);
*/

// --- HIDE CONSTRUCT UI ELEMS ---
/* <<< This function remains unused
function hideConstructUI(){
    // ... function body ...
}
*/


//----- CHAT FUNCTIONS ----- (Sending via HTML, Receiving Triggered by C2) -----

function sendMessage(){
    // Sending via HTML UI is KEPT ACTIVE (Test removing if issues persist)
    let chatContent = $("#chat-input").val();
    if (!chatContent || chatContent.trim() === "") return; // Don't send empty messages

    let username =  getUsername();
    // Call the C2 function to handle adding the chat locally and sending via Multiplayer
    c2_callFunction( "addChat", [username, chatContent]);
    $("#chat-input").val(""); // Clear input after sending
}

// Enter key registration for HTML input is KEPT ACTIVE
$("#chat-input").on("keydown",sendMessageOnEnter);

function sendMessageOnEnter(e){
    if (e.code == "Enter"){
        sendMessage();
    }
}

// --- getUsername is needed for sendMessage ---
function getUsername(){
    try {
        const usernameVar = cr_getC2Runtime().all_global_vars.find( (e) => e.name=="Username");
        return usernameVar ? usernameVar.data : "Guest";
    } catch (e) {
        console.error("Error getting username from C2 runtime:", e);
        return "Guest";
    }
}

// --- Chat display function - NOW TRIGGERED BY C2 ---
window.c2_receivedChatUpdate = function() {
    // console.log("c2_receivedChatUpdate called"); // Optional log
    let logsObject = getMessageLogsFromRuntime();
    if (!logsObject || !logsObject.arr) {
        return;
    }

    toggleMessageNotification("on"); // Show notification if window is hidden
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
    // (Still potentially fragile, but only called when C2 triggers update)
    try {
        const msgLogObj = cr_getC2Runtime().getObjectByUID(29);
        return msgLogObj ? msgLogObj : { arr: [] };
    } catch (e) {
        console.error("Error getting LogMessages from C2 runtime:", e);
        return { arr: [] };
    }
}

// --- Flag functions REMOVED ---
/*
function getChatUpdateFlagFromRuntime() { ... }
function resetChatUpdateFlagInRuntime() { ... }
function getStepsUpdateFlagFromRuntime() { ... }
function resetStepsUpdateFlagInRuntime() { ... }
*/

//  ----30 TEXT HANDLING ----- (Triggered by C2) ----

window.c2_receivedStepsUpdate = function() {
    // console.log("c2_receivedStepsUpdate called"); // Optional log
    let text = get30TextFromRuntime();
    $("#steps").text( text );
    let progressMatch = text.match(/(\d+(\.\d+)?)\s*%/g);
    let progressValue = progressMatch ? parseFloat(progressMatch[0]) : 0;
    let progressPercent = progressValue / 30;
    updateGameProgressBar(progressPercent);
}

function get30TextFromRuntime(){
    // (Only called when C2 triggers update)
    try {
        const textObj = cr_getC2Runtime().getObjectByUID(21);
        return textObj ? textObj.text : "";
    } catch (e) {
        console.error("Error getting 30Text from C2 runtime:", e);
        return "";
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

