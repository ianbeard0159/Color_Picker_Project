
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
                      id = "' + inList[i] + '"></div>';
    }
    $(".palate-window").html(htmlString);
}

// Fill the list of existing palates in the save/lad menus
function populate_palate_list(inUser){
    $(".existing-palate-field").html("- No Palates Exist");
    $.post("http://127.0.0.1:8081/populate-palate-list",
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
    // Initialize the text fields
    $("#loginUser").val("");
    $("#username").val("");
    // Initialize the color display
    change_color(hue, saturation, lightness);
    $("#palate-lable").text("Current Palate: -");
    // Toggle the color's hue using the arrow buttons
    $(".hue-left").click(function(){
        if(hue > 0){
            hue--;
            change_color(hue, saturation, lightness);
        }
    });
    $(".hue-right").click(function(){
        if(hue < 360){
            hue++;
            change_color(hue, saturation, lightness);
        }
    });

    // Toggle the color's sturation using the arrow buttons
    $(".saturation-left").click(function(){
        if(saturation > 0){
            saturation--;
            change_color(hue, saturation, lightness);
        }
    });
    $(".saturation-right").click(function(){
        if(saturation < 100){
            saturation++;
            change_color(hue, saturation, lightness);
        }
    });

    // Toggle the color's lightness using the arrow buttons
    $(".lightness-left").click(function(){
        if(lightness > 0){
            lightness--;
            change_color(hue, saturation, lightness);
        }
    });
    $(".lightness-right").click(function(){
        if(lightness < 100){
            lightness++;
            change_color(hue, saturation, lightness);
        }
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

    // Change the color to field entries on keystroke
    $("input[id=hue-field]").keyup(function(){

        // Make sure that the Hue is between 0 and 360
        hue = $("#hue-field").val();
        if(hue > 360){
            hue = 360;
        }
        else if(hue < 0){
            hue = 0;
        }

        change_color(hue, saturation, lightness);
    });

    // Change the color to field entries on keystroke
    $("input[id=saturation-field]").keyup(function(){

        // Make sure that the Saturation is between 0 and 100
        saturation = $("#saturation-field").val();
        if(saturation > 100){
            saturation = 100;
        }
        else if(saturation < 0){
            saturation = 0;
        }

        change_color(hue, saturation, lightness);
    });

    // Change the color to field entries on keystroke
    $("input[id=lightness-field]").keyup(function(){

        // Make sure that the Lightness is between 0 and 100
        lightness = $("#lightness-field").val();
        if(lightness > 100){
            lightness = 100;
        }
        else if(lightness < 0){
            lightness = 0;
        }

        change_color(hue, saturation, lightness);
    });

    // -=Manage modals used by the application=-

    // Change enterpress function depending on the state variable
    $(document).keypress(function(e){
        if(e.which == 13){
            if(state == "login"){
                $("#login-btn").click();
            }
            else if(state == "new-user"){
                $("#new-user-btn").click();
            }
            else if(state == "main"){
                $(".text.color-text").click();
            }
        }
    });

    // Attempt to log into an existing account
    $("#login-btn").click(function(){
        user = $("#loginUser").val();
        pass = $("#loginPass").val();
        // Check the database to see if the submitted login credentials are valid
        $.post("http://127.0.0.1:8081/login",
        {
            user: $("#loginUser").val(),
            pass: $("#loginPass").val()
        },
        function(data, status){
            if(data == "fail"){
                $(".login-error").text("Username and password do not match");
            }
            else{
                currentUser = $("#loginUser").val();
                $("#user-lable").text("Current User: " + currentUser);
                $(".modal").css("display", "none");
                $(".new-user-menu").css("display", "none");
                $(".start-menu").css("display", "none");
                state = "main";
            }
        });
    });
    // Open the create account window
    $("#new-user-link").click(function(){
        $(".start-menu").css("display", "none");
        $(".new-user-menu").css("display", "block");
        state = "new-user";
    });
    // Attempt to create a new account with the provided credentials
    $("#new-user-btn").click(function(){
        console.log($("#loginUser").val());
        // Check the database to see if the submitted login credentials are valid
        $.post("http://127.0.0.1:8081/new-user",
        {
            user: $("#username").val(),
            passA: $("#passA").val(),
            passB: $("#passB").val()
        },
        function(data, status){
            if(data == "success"){
                currentUser = $("#username").val();
                $("#user-lable").text("Current User: " + currentUser);
                $(".new-user-menu").css("display", "none");
                $(".modal").css("display", "none");
                state = "main";
            }
            else{
                $("#new-user-requirements").css("display", "none");
                $("#new-user-errors").html(data);
            }
        });
    });
    // Create a new palate
    $("#new-palate-btn").click(function(){
        console.log("New Palate Attempt");
        inPalate = $("#palate-name").val();
        // Attempt to create the new palate
        $.post("http://127.0.0.1:8081/new-palate",
        {
            user: currentUser,
            name: inPalate
        },
        function(data, status){
            if(data == "success"){
                currentPalate = inPalate;
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
    $(".button#new-palate").click(function(){
        $(".modal").css("display", "block");
        $(".new-palate-menu").css("display", "block");
        $(".text-field").val("");
        state = "new palate";
    });
    $("a[id =cancel-link]").click(function(){
        $(".modal").css("display", "none");
        $(".new-palate-menu").css("display", "none");
        $(".load-palate.menu").css("display", "none");
        $(".save-palate.menu").css("display", "none");
        state = "main";
        selectedPalate = "";
    });
    // Add a color to the palate
    $(".text.color-text").click(function(){
        palateList.push("hsl(" + hue + "," + saturation + "%," + lightness + "%)");
        populate_palate_menu(palateList);
    });
    // Empty the palate
    $(".text.palate-text").click(function(){
        palateList = [];
        populate_palate_menu(palateList);
    });
    // Load Palate
    $(".button#load-palate").click(function(){
        $(".modal").css("display", "block");
        $(".load-palate.menu").css("display", "block");
        populate_palate_list(currentUser);
        state = "load palate";
    });
    $(".existing-palate-field").on("click", "p.palate-list-entry", function(e){
        $(".palate-list-entry").css("background-color", "rgba(0, 0, 0, 0)");
        $(this).css("background-color", "rgba(0, 20, 40, 0.5)");
        selectedPalate = e.target.id;
        if(state = "save palate"){
            $("#save-field").val(selectedPalate);
        }
    });
    $("#load-palate-btn").click(function(){
        if(selectedPalate != ""){
            currentPalate = selectedPalate;
            selectedPalate = "";
            $.post("http://127.0.0.1:8081/load-palate",
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
            state = "main"
        }
    });
    // Save Palate
    $(".button#save-palate").click(function(){
        $(".modal").css("display", "block");
        $(".save-palate.menu").css("display", "block");
        populate_palate_list(currentUser);
        state = "save palate";
    });
    $(".save-text").click(function(){
        var inPalate = selectedPalate;
        var colorObj = {colorArray: palateList};

        console.log(inPalate);

        $.post("http://127.0.0.1:8081/save-palate",
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
                state = "main"
            }
            else{
                console.log("Fail");
            }
        });
    });

});