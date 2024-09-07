
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
        $(itemId).css("position", "absolute");//empty string restores imported styling
        return;
    }
}

function toggleSplash(){
    toggleDisplay(".login-page");
}
function toggleMenu(){
    toggleDisplay("#play-menu");
    console.log("toggle menu")
}
function toggleChat(){
    toggleDisplay("#chat-window");
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
    console.log(value);
    $("#audio-state").text(value);
}


//----- CHAT FUNCTIONS ----- TODO

function sendMessage(){
}
function displayMessage(){
}

// ADJUST ZOOM OF THE BACKGROUND

$("#zoom-slider").on("input", function(e) {
    let zoom_level = $(e.target).val();
    $("#zoom-level").text( zoom_level ) //update Debug read
    updateGameProgressBar(zoom_level/0.3);
    zoomMapUpdate(zoom_level);

});

$("#zoom-slider").trigger("input");

function updateGameProgressBar(percent){
    let progress_gradient = "linear-gradient( 0deg, var(--red-accent) "+percent+"%, #9999 "+percent+"%)";
    $("#game-progress-bar").css("background", progress_gradient);
}
updateGameProgressBar(3);

function zoomMapUpdate(val){
    let center      = "translateY("+80*val+"px) ";
    let zoom        = "perspective(500px) translateZ("+(400-(3*val))+"px) ";
    
    $("#earth-map").css("transform",   center+ zoom);

}

