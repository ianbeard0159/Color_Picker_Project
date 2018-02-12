
// Change the selected color based on user input
function change_color(inH, inS, inL)
{
    // Set the color window to the apropriate color
    $(".color-window").css(
        "background-color", "hsl(" + inH + ", " + inS + "%, " + inL + "%)");
    // Set the input windows to the apropriate values
    // Hue
    $(".hue-selector").css("margin-left", ((inH*100)/360) + "%");
    $(".hue-bar").css("background", 
    "linear-gradient(to right, "
        + "hsl(0,"   + inS + "%," + inL + "%), "
        + "hsl(60,"  + inS + "%," + inL + "%), "
        + "hsl(120," + inS + "%," + inL + "%), "
        + "hsl(180," + inS + "%," + inL + "%), "
        + "hsl(240," + inS + "%," + inL + "%), "
        + "hsl(300," + inS + "%," + inL + "%), "
        + "hsl(360," + inS + "%," + inL + "%)");
    // Saturation
    $(".saturation-selector").css("margin-left", inS + "%");
    $(".saturation-bar").css("background", 
    "linear-gradient(to right, "
        + "hsl(" + inH + ", 0%," + inL + "%), "
        + "hsl(" + inH + ", 100%," + inL + "%)");
    // Lightness
    $(".lightness-selector").css("margin-left", inL + "%");
    $(".lightness-bar").css("background", 
    "linear-gradient(to right, "
        + "hsl(" + inH + ", " + inS + "%, 0%), "
        + "hsl(" + inH + ", " + inS + "%, 50%), "
        + "hsl(" + inH + ", " + inS + "%, 100%)");
    // Make sure that the fields are set to the appropriate values
    $("#hue-field").val(inH);
    $("#saturation-field").val(inS);
    $("#lightness-field").val(inL);
    // Set the text to the apropriate value
    $("#color-text").text("hsl(" + inH + ", " + inS + "%, " + inL + "%)");
}
// Fill the palate menu with the contents of the current palate
function populate_palate_menu(inList){
    htmlString = "";
    for(i = 0; i < inList.length; i++){
        htmlString += '<div class = "palate-entry" \
                      style = "background-color: ' + inList[i] + '" \
                      id = "' + inList[i] + '"> \
                      <div class = "palate-entry-x" id = "' + inList[i] + '-x">x \
                      </div></div>';
    }
    $(".palate-window").html(htmlString);
}

// Fill the list of existing palates in the save/lad menus
function populate_palate_list(inUser, inPalate){
    $(".existing-palate-field").html("- No Palates Exist");
    $.post("/populate-palate-list",
    {
        user: inUser
    },
    function(data, status){
        if(data != "fail"){
            $("#save-field").val("");
            var output = JSON.parse(data);
            var html = "";
            for(i = 0; i < output.palateArray.length; i++){
                html += "<p class='palate-list-entry'id='" 
                      + output.palateArray[i] + "'> - " 
                      + output.palateArray[i] + "</p>";
            }
            if(html != ""){
                $(".existing-palate-field").html(html);
                document.getElementById(inPalate).click();
                console.log("Current Palate: " + inPalate);
            }
        }
        else{
            console.log("Fail");
        }
    });
    
}

// -= Main Function =-
$(document).ready(function(){
    var hue = 0;
    var saturation = 100;
    var lightness = 50;
    var currentUser = "";
    var currentPalate = "";
    var selectedPalate = "";
    var palateList = [];
    var state = "login";
    var buttonHeld = false;

    var s_slider = document.getElementById("saturation-slider");
    s_slider.value = saturation;
    var h_slider = document.getElementById("hue-slider");
    h_slider.value = hue;
    var l_slider = document.getElementById("lightness-slider");
    l_slider.value = lightness;

    // Initialize the text fields
    $("#loginUser").val("");
    $("#username").val("");
    // Initialize the color display
    change_color(hue, saturation, lightness);
    $("#palate-lable").text("Current Palate: -");

    // -= Hue Selector =-

    // Change hue with arrow buttons
    $(".hue-left").click(function(){
        if(hue > 0){
            hue--;
            change_color(hue, saturation, lightness);
            h_slider.value = hue;
        }
    });
    $(".hue-right").click(function(){
        if(hue < 360){
            hue++;
            change_color(hue, saturation, lightness);
            h_slider.value = hue;
        }
    });
    // Change hue with slider
    h_slider.oninput = function(){
        hue = this.value;
        change_color(hue, saturation, lightness);
    };
    // Change hue on keystroke
    $("input[id=hue-field]").keyup(function(){

        // Make sure that the Hue is between 0 and 360
        hue = $("#hue-field").val();
        if(hue > 360){
            hue = 360;
        }
        else if(hue < 0){
            hue = 0;
        }
        h_slider.value = hue;

        change_color(hue, saturation, lightness);
    });

    // -= Saturation Selector =-

    // Change saturation with arrow buttons
    $(".saturation-left").click(function(){
        if(saturation > 0){
            saturation--;
            s_slider.value = saturation;
            change_color(hue, saturation, lightness);
        }
    });
    $(".saturation-right").click(function(){
        if(saturation < 100){
            saturation++;
            s_slider.value = saturation;
            change_color(hue, saturation, lightness);
        }
    });
    // Change saturation with slider
    s_slider.oninput = function(){
        saturation = this.value;
        change_color(hue, saturation, lightness);
    };
    // Change saturation on keystroke
    $("input[id=saturation-field]").keyup(function(){

        // Make sure that the Saturation is between 0 and 100
        saturation = $("#saturation-field").val();
        if(saturation > 100){
            saturation = 100;
        }
        else if(saturation < 0){
            saturation = 0;
        }
        s_slider.value = saturation;

        change_color(hue, saturation, lightness);
    });

    // -= Lightness Slider =-

    // Change lightness with arrow buttons
    $(".lightness-left").click(function(){
        if(lightness > 0){
            lightness--;
            change_color(hue, saturation, lightness);
            l_slider.value = lightness;
        }
    });
    $(".lightness-right").click(function(){
        if(lightness < 100){
            lightness++;
            change_color(hue, saturation, lightness);
            l_slider.value = lightness;
        }
    });
    // Change lightness with slider
    l_slider.oninput = function(){
        lightness = this.value;
        change_color(hue, saturation, lightness);
    };
    // Change lightness on keystroke
    $("input[id=lightness-field]").keyup(function(){

        // Make sure that the Lightness is between 0 and 100
        lightness = $("#lightness-field").val();
        if(lightness > 100){
            lightness = 100;
        }
        else if(lightness < 0){
            lightness = 0;
        }
        l_slider.value = lightness;

        change_color(hue, saturation, lightness);
    });

    // Change the color of clickable elements on mouse events
    $(".clickable").hover(function(){
        $(this).css("background", 
        "radial-gradient(rgba(50, 235, 255, .644), rgb(50, 235, 255))");
    },
    function(){
        $(this).css("background", 
        "radial-gradient(rgba(0, 196, 230, 0.644), rgb(0, 195, 230))");
    });
    $(".clickable").mousedown(function(){
        $(this).css("background", 
        "radial-gradient(rgba(0, 186, 220, 0.644), rgb(0, 186, 220))");
    });
    $(".clickable").mouseup(function(){
        $(this).css("background", 
        "radial-gradient(rgba(50, 235, 255, .644), rgb(50, 235, 255))");
    });

    // -= Manage modals used by the application =-

    // Change enterpress function depending on the state variable
    $(document).on('keydown',function(e){
        if(e.which == 13 || e.keyCode == 13){
            console.log("Enterpress,\nCurrent State: " + state);
            e.preventDefault();

            // Login Menu
            if(state == "login"){
                $("#login-btn").click();
            }
            // New Account Menu
            else if(state == "new-user"){
                $("#new-user-btn").click();
            }
            // Load Menu
            else if(state == "load palate"){
                $("#load-palate-btn").click();
            }
            // Save Menu
            else if(state == "save palate"){
                $(".save-text").click();
            }
            // New Palate Menu
            else if(state == "new palate"){
                $("#new-palate-btn").click();
            }
            // Main Page
            else if(state == "main"){
                $(".text.color-text").click();
            }
            // Unexpected Cases
            else{
                console.log("enter");
            }
        }
    });
    // Have the cancel link in any menu return to the main page
    $("a[id =cancel-link]").click(function(){
        console.log("cancel");
        $(".modal").css("display", "none");
        $(".new-palate-menu").css("display", "none");
        $(".load-palate.menu").css("display", "none");
        $(".save-palate.menu").css("display", "none");
        state = "main";
        selectedPalate = "";
        $(".existing-palate-field").html("");
    });
    // Add a color to the palate
    $(".text.color-text").click(function(){
        // No duplicate entries in the palate list
        var check = true;
        for(var i = 0; i < palateList.length; i++){
            if(palateList[i] == "hsl(" + hue + "," + saturation + "%," + lightness + "%)"){
                check = false;
            }
        }
        if(check){
            console.log("Add Color: hsl(" + hue + "," + saturation + "%," + lightness + "%)");
            palateList.push("hsl(" + hue + "," + saturation + "%," + lightness + "%)");
            populate_palate_menu(palateList);
        }
    });
    // Empty the palate
    $(".text.palate-text").click(function(){
        console.log("Clear Palate");
        palateList = [];
        populate_palate_menu(palateList);
    });
    // Select palate from save/load menu
    $(".existing-palate-field").on("click", "p.palate-list-entry", function(e){
        $(".palate-list-entry").css("background-color", "rgba(0, 0, 0, 0)");
        $(this).css("background-color", "rgba(0, 20, 40, 0.5)");
        selectedPalate = e.target.id;
        console.log("Selected Palate: " + selectedPalate);
        if(state = "save palate"){
            $("#save-field").val(selectedPalate);
        }
    });
    // Click a palate entry to change the color
    $(".palate-window").on("click", ".palate-entry", function(e){
        var colorString = e.target.id;
        // Don't run if the 'x' on the color was clicked
        var check = colorString.search("-x");
        if(check == -1){
            console.log("Selected Color: " + colorString);
    
            // Change 'hsl(#,#%,#%) into #,#,# then split the values into an array
            colorString = colorString.replace("hsl(", "");
            colorString = colorString.replace(/%/g, "");
            colorString = colorString.replace(")", "");
            var colorArray = colorString.split(",");
    
            // Change the color value to the selected color
            h_slider.value = hue = colorArray[0];
            s_slider.value = saturation = colorArray[1];
            l_slider.value = lightness = colorArray[2];
            change_color(colorArray[0], colorArray[1], colorArray[2]);
        }
    });
    // Have the palate entry's 'x' appear on mouse hover
    $(".palate-window").on("mouseenter", ".palate-entry", function(e){
        $(this).css("border-style", "solid");
        var entryX = document.getElementById(e.target.id + "-x");
        $(entryX).css("display", "block"); 
    });
    $(".palate-window").on("mouseleave", ".palate-entry", function(e){
        $(this).css("border-style", "none");
        var entryX = document.getElementById(e.target.id + "-x");
        $(entryX).css("display", "none"); 
    });
    $(".palate-menu").on("mouseleave", function(){
        $(".palate-entry-x").css("display", "none"); 
    });
    // Remove a color from the palate list
    $(".palate-window").on("click", ".palate-entry-x", function(e){
        var palateEntry = (e.target.id).replace("-x", "");
        console.log("Removing: " + palateEntry);
        var color = "";
        var index = 0;
        for(var i = 0; i < palateList.length; i++){
            console.log(palateList[i] + " =? " + palateEntry);
            if(palateList[i] == palateEntry){
                color = palateEntry;
                index = i;
            }
        }
        palateList.splice(index, 1);
        console.log("Found: " + color);
        if(color){
            populate_palate_menu(palateList);
        }
    });

    // -= Login Menu =-

    // Attempt to log into an existing account
    $("#login-btn").click(function(){
        console.log("Login Attempt: " + $("#loginUser").val());
        user = $("#loginUser").val();
        pass = $("#loginPass").val();
        // Check the database to see if the submitted login credentials are valid
        $.post("/login",
        {
            user: $("#loginUser").val(),
            pass: $("#loginPass").val()
        },
        function(data, status){
            if(data == "fail"){
                $(".login-error").text("Username and password do not match");
            }
            else{
                state = "main";
                currentUser = $("#loginUser").val();
                $("#user-lable").text("Current User: " + currentUser);
                $(".modal").css("display", "none");
                $(".new-user-menu").css("display", "none");
                $(".start-menu").css("display", "none");
            }
        });
    });
    // Open the create account window
    $("#new-user-link").click(function(){
        console.log("Open New Account Menu");
        state = "new-user";
        $(".start-menu").css("display", "none");
        $(".new-user-menu").css("display", "block");
    });
    // Attempt to create a new account with the provided credentials
    $("#new-user-btn").click(function(){
        console.log("New User Attempt: " + $("#username").val());
        // Check the database to see if the submitted login credentials are valid
        $.post("/new-user",
        {
            user: $("#username").val(),
            passA: $("#passA").val(),
            passB: $("#passB").val()
        },
        function(data, status){
            if(data == "success"){
                state = "main";
                currentUser = $("#username").val();
                $("#user-lable").text("Current User: " + currentUser);
                $(".new-user-menu").css("display", "none");
                $(".start-menu").css("display", "none");
                $(".modal").css("display", "none");
            }
            else{
                $("#new-user-requirements").css("display", "none");
                $("#new-user-errors").html(data);
            }
        });
    });

    // -= New Palate Menu =-

    // Create a new palate
    $("#new-palate-btn").click(function(){
        inPalate = $("#palate-name").val();
        console.log("New Palate Attempt: " + inPalate);
        // Attempt to create the new palate
        $.post("/new-palate",
        {
            user: currentUser,
            name: inPalate
        },
        function(data, status){
            if(data == "success"){
                currentPalate = inPalate;
                palateList = [];
                populate_palate_menu(currentPalate);
                $(".modal").css("display", "none");
                $(".new-palate-menu").css("display", "none");
                $("#palate-lable").text("Current Palate: " + currentPalate);
                state = "main"
            }
            else{
                console.log("Fail");
            }
        });
    })
    // Open Menu
    $(".button#new-palate").click(function(){
        console.log("Open New Palate Menu");
        state = "new palate";
        $(".modal").css("display", "block");
        $(".new-palate-menu").css("display", "block");
        $(".text-field").val("");
    });

    // -= Load Palate Menu =-

    // Open Menu
    $(".button#load-palate").click(function(){
        console.log("Open Load Menu");
        state = "load palate";
        $(".modal").css("display", "block");
        $(".load-palate.menu").css("display", "block");
        populate_palate_list(currentUser);
    });
    // Load the selected palate
    $("#load-palate-btn").click(function(){
        console.log("Load Attempt: " + selectedPalate);
        if(selectedPalate != ""){
            currentPalate = selectedPalate;
            selectedPalate = "";
            $.post("/load-palate",
            {
                user: currentUser,
                palate: currentPalate
            },
            function(data, status){
                if(data != "fail"){
                    palateList = [];
                    var output = JSON.parse(data);
                    for(i = 0; i < output.outColors.length; i++){
                        palateList.push(output.outColors[i]);
                    }
                    populate_palate_menu(palateList);
                }
                else{
                    console.log("Fail");
                }
            });
            $(".modal").css("display", "none");
            $(".load-palate.menu").css("display", "none");
            $("#palate-lable").text("Current Palate: " + currentPalate);
            $(".palate-window").html("");
            $(".existing-palate-field").html("");
            selectedPalate = "";
            state = "main"
        }
    });

    // -= Save Palate Menu =-

    // Open Menu
    $(".button#save-palate").click(function(){
        console.log("Open Save Menu");
        state = "save palate";
        $(".modal").css("display", "block");
        $(".save-palate.menu").css("display", "block");
        populate_palate_list(currentUser, currentPalate);
    });
    // Save as the selected palate
    $(".save-text").click(function(){
        var inPalate = $("#save-field").val();
        console.log("Save Attempt: " + inPalate);
        var colorObj = {colorArray: palateList};

        console.log(inPalate);

        $.post("/save-palate",
        {
            user: currentUser,
            palate: inPalate,
            colors: JSON.stringify(colorObj)
        },
        function(data, status){
            if(data != "fail"){
                currentPalate = data;
                $("#palate-lable").text("Current Palate: " + currentPalate);
                $(".save-palate.menu").css("display", "none");
                $(".modal").css("display", "none");
                $(".existing-palate-field").html("");
                selectedPalate = "";
                state = "main"
            }
            else{
                console.log("Fail");
            }
        });
    });

});