//----- UI UPDATE LOOP ------

function UpdateUI(){
    // --- COMMENTED OUT ---
    // display30Text();
    // displayMessages();
    // --- COMMENTED OUT ---
}

// --- Game Loop using requestAnimationFrame ---
function GameLoop() {
    // --- COMMENTED OUT ---
    // UpdateUI(); // No longer calling UI updates from the loop
    // --- COMMENTED OUT ---

    // Still request the next frame to keep the loop structure if needed elsewhere,
    // but it won't do chat/steps updates.
    requestAnimationFrame(GameLoop);
}

// Start the loop (can be commented out if nothing else uses it)
// requestAnimationFrame(GameLoop);


// --- HIDE CONSTRUCT UI ELEMS ---
/* <<< This function remains unused
function hideConstructUI(){
    // ... function body ...
}
*/


//----- CHAT FUNCTIONS ----- (Send Only) -----

function sendMessage(){
    // Sending via HTML UI is KEPT ACTIVE
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

// --- Chat display functions COMMENTED OUT ---
/*
function displayMessages(){
    // ... function body ...
}

function formatMessageLogsToHTML(logs){
    // ... function body ...
}

function getMessageLogsFromRuntime(){
    // ... function body ...
}

function getChatUpdateFlagFromRuntime() {
    // ... function body ...
}

function resetChatUpdateFlagInRuntime() {
    // ... function body ...
}
*/

//  ----30 TEXT HANDLING ----- (COMMENTED OUT) ----
/*
function display30Text(){
    // ... function body ...
}

function get30TextFromRuntime(){
    // ... function body ...
}

function getStepsUpdateFlagFromRuntime() {
    // ... function body ...
}

function resetStepsUpdateFlagInRuntime() {
    // ... function body ...
}

function updateGameProgressBar(percent){
    // ... function body ...
}
*/

//---- HANDLE RESIZING ----- (Keep for general UI layout)
function placeUI(){ $("#UI").css( "width", $("#c2canvas").css("width") ); $("#UI").css( "height", $("#c2canvas").css("height") ); }
setTimeout(placeUI, 300); setTimeout(placeUI, 1000); setTimeout(placeUI, 5000);
addEventListener('resize', ()=>{ setTimeout(placeUI, 50) })

//---- UI TOGGLES ------- (Keep basic toggles, remove chat/steps specific logic if desired)
function toggleDisplay(itemId){ if( $(itemId).css("visibility") === "hidden"){ $(itemId).css({"visibility":"", "height":"", "opacity":"", "position":""}); return; } else { $(itemId).css({"visibility":"hidden", "height":"0px", "opacity":"0", "position":"absolute"}); return; } }
function toggleSplash(){ toggleDisplay(".login-page"); }
function toggleMenu(){ toggleDisplay("#play-menu"); }
// --- Comment out chat/steps specific toggle logic ---
function toggleMessageNotification(state){ /* Keep empty or remove */ }
function toggleChat(){ toggleDisplay("#chat-window"); /* Keep basic toggle if #chat-window HTML exists */ }
function toggleSteps(){ toggleDisplay("#steps-window"); }

// --- Comment out initial toggles if C2 UI should be visible ---
// toggleMenu();
// toggleChat();

function toggleValueOnOff(itemId){ if ($(itemId).attr("value") == "on"){ $(itemId).attr("value", "off"); return "off"; } if ($(itemId).attr("value") == "off"){ $(itemId).attr("value", "on"); return "on"; } }
async function toggleAudio(){ let value = toggleValueOnOff("#menu-mute"); $("#audio-state").text(value); }

