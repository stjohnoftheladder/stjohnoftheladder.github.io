

//----- UI UPDATE LOOP ------

function UpdateUI(){
    display30Text();
    displayMessages();
    hideConstructUI();
}

setInterval(UpdateUI, 250);

// --- HIDE CONSTRUCT UI ELEMS ---
/*
These elements need to be set to visible false because
they need to still exist for the UI to read them,
but we don't want to duplicate UI
*/

function hideConstructUI(){
    //30Text
    cr_getC2Runtime().getObjectByUID(21).visible = false;
    cr_getC2Runtime().getObjectByUID(21).y-=2000; //sends elem to the shadow realm
    //TextLogText
    cr_getC2Runtime().getObjectByUID(12).visible = false;
    cr_getC2Runtime().getObjectByUID(12).y-=2000;
    //ChatSend
    cr_getC2Runtime().getObjectByUID(32).visible = false;
    cr_getC2Runtime().getObjectByUID(32).y-=2000;
    //ChatTextBox
    cr_getC2Runtime().getObjectByUID(31).visible = false;
    cr_getC2Runtime().getObjectByUID(68).y-=2000;
    //O_DIALOG
    cr_getC2Runtime().getObjectByUID(68).visible = false;
    cr_getC2Runtime().getObjectByUID(68).y-=2000;
}


//----- CHAT FUNCTIONS ----- TODO

function sendMessage(){
    let chatContent = $("#chat-input").val();
    let username =  getUsername();
    let chatArray = c2_callFunction( "addChat", [username, chatContent]);
    displayMessages();
    $("#chat-input").val("");
}
$("#chat-input").on("keydown",sendMessageOnEnter);
function sendMessageOnEnter(e){
    if (e.code == "Enter"){
        sendMessage();
    }
}

// HACKY -- ideally a function is built in Construct to return this data
// This function is an interface get data from the Construct 2 runtime
function getUsername(){
    return cr_getC2Runtime().all_global_vars.find( (e) => e.name=="Username").data;
}

var lastLogHTML;

function displayMessages(){
    let logs = getMessageLogsFromRuntime().arr;
    let html = formatMessageLogsToHTML(logs);
    if( lastLogHTML == html){
        return 0;
    }
    toggleMessageNotification("on");
    lastLogHTML = html;
    $("#chat").html(html);
}

// HACKY -- ideally we encode information 
// into the array of Messages.log
// and use that to prepare the messages
function formatMessageLogsToHTML(logs){
    let html = ""; //stores html for message log
    for (let i = 0; i < logs.length; i++){
        html+="\n"
        let message = logs[i][0][0];
        let klass = "message ";
        if( message.match(/^<[\w]+> /g)){ //  checks for pattern of username in message
            message = message.replaceAll("<", "&lt").replaceAll(">", "&gt");
            klass += "player-chat ";
            html += `<div class="`+klass+`">`+message+`</div>`;
            continue;
        }
        if( message.match(/err/i) ){ //checks for "err" hopefully catching "error" at the same time
            klass += "system-err ";
            html += `<div class="`+klass+`">`+message+`</div>`;
            continue;
        }
        else{
            html += `<div class="`+klass+`">`+message+`</div>`;
            continue;
        }
    }
    return html;
}

// HACKY ideally a function is implemented 
// in Construct to return this data
function getMessageLogsFromRuntime(){
    return cr_getC2Runtime().getObjectByUID(29) //MessageLogs array UID is 29
}

//  ----30 TEXT HANDLING ---------

function display30Text(){
    let text = get30TextFromRuntime();
    $("#steps").text( text );
    let progressPercent = Number( text.match(/\d+\.\d\s/g) )/30;
    updateGameProgressBar(progressPercent);
}

// HACKY ideally a function is implemented in Construct
// to return this data
function get30TextFromRuntime(){
    let text30 = cr_getC2Runtime().getObjectByUID(21).text;
    return text30 ? text30 : "";
}

//---- HANDLE RESIZING -----

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

//---- UI TOGGLES -------

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
        $(itemId).css("opacity", "100");
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
    if( 
        state == "on" && 
        ($("#chat-window").css("visibility") == "hidden")
    ){
        $("#chat-window-toggle").addClass("red-bg");
        return;
    }
    if(state == "off"){
        $("#chat-window-toggle").removeClass("red-bg");
        return;
    }
}
function toggleChat(){
    toggleDisplay("#chat-window");
    toggleMessageNotification("off");
}
function toggleSteps(){
    toggleDisplay("#steps-window");
}

//hide menu and chat initially
toggleMenu();
toggleChat();

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


// ADJUST ZOOM OF THE BACKGROUND -- NOT IMPLEMENTED

/*
$("#zoom-slider").on("input", function(e) {
    let zoom_level = $(e.target).val();
    $("#zoom-level").text( zoom_level ) //update Debug read
    updateGameProgressBar(zoom_level/0.3);
    zoomMapUpdate(zoom_level);

});

$("#zoom-slider").trigger("input");
*/
function updateGameProgressBar(percent){
    let progress_gradient = "linear-gradient( 0deg, var(--red-accent) "+percent+"%, #9999 "+percent+"%)";
    $("#game-progress-bar").css("background", progress_gradient);
}
/*
function zoomMapUpdate(val){
    let center      = "translateY("+80*val+"px) ";
    let zoom        = "perspective(500px) translateZ("+(400-(3*val))+"px) ";
    
    $("#earth-map").css("transform",   center+ zoom);

}

*/