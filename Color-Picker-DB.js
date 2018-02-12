var mysql = require('mysql');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();

// -=Local Host Connection to Server=-

var con = mysql.createConnection({

    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT
});

// Create a new database
function create_db(name){

    // Create the new database if it doesn't already exist
    con.database = name;
    var sql = "CREATE DATABASE IF NOT EXISTS " + name;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Database '" + name + "' created or already exists");
    });

    // Set the new database as the active one
    con.query("USE " + name, function (err, result) {
        if (err) throw err;
        console.log("Database '" + name + "' selected");
    });
}

// Create a new table
function create_table(name, columns){

    // Convert the input columns into a string to be used in the query
    columnString = "(";
    firstLoop = true;
    for (x in columns){
        if(!firstLoop){
            columnString += ", "
        }
        columnString += columns[x];
        firstLoop = false;
    }
    columnString += ");";

    // Add the new table to the database if it doen't already exist
    var sql = "CREATE TABLE IF NOT EXISTS " + name + columnString;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table '" + name + "' created or already exists");
    });
}

// Drop an existing table
function drop_table(name){
    
    var sql = "DROP TABLE IF EXISTS " + name;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table '" + name + "' dropped or didn't exist");
      });
}

// Create an entry in the database for a new palate
function add_palate(user, name){
    console.log("Add Palate: " + name);
    // Identify User
    var input = [user];
    var sql = "SELECT user_id FROM userTable WHERE username = ?;";
    con.query(sql, input, function(err, result) {
        if(err) throw err;
        userID = result[0].user_id;

        // Add the palate to the database under the current user's account
        input = [userID, name];
        sql = "INSERT INTO palateTable (user_id, palate_name) " 
        + "VALUES (?, ?)";
        con.query(sql, input, function(err, result){
            if(err) throw err;
            console.log("palate added");
        });
    });
}


// When the connection is established, create the database if it doesn't
//      already exist
con.connect(function(err) {

  if (err) throw err;
  console.log("Connected!");

    // Define tables used in database
    var userTable = [
        "user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "username VARCHAR(255)",
        "pass VARCHAR(255)"
    ]
    var palateTable = [
        "palate_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "palate_name VARCHAR(255)",
        "user_id INT",
        "FOREIGN KEY (user_id) REFERENCES userTable(user_id)"
    ]
    var colorTable = [
        "color_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "color_value VARCHAR(255)",
        "palate_id INT",
        "FOREIGN KEY (palate_id) REFERENCES palateTable(palate_id)"
    ]

    // Create the database and tables if they don't already exist
    create_db("colorPickerDB");
    create_table("userTable", userTable);
    create_table("palateTable", palateTable);
    create_table("colorTable", colorTable);

});

// -= Express Framework =-

// Set static files
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '/static')));

// Set up parser for data used by database calls
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// Load the home page
app.get('/', function(req, res){
    res.sendFile(path.resolve(__dirname + "/" + "static/HTML/Color-Picker.html"));
    console.log(__dirname + "/" + "static/HTML/Color-Picker.html");
});

// Check if the user has valid login credentials
app.post('/login', urlencodedParser, function(req, res){
    var inUser = req.body.user;
    var inPass = req.body.pass;
    console.log("Login Attempt: " + inUser);

    // Check if the input username/password combination is in the database
    var input = [inUser, inPass];
    var sql = "SELECT username, pass FROM userTable WHERE EXISTS (" 
                + "SELECT username, pass FROM userTable WHERE "
                + "username = ? AND "
                + "pass = ?);";
    con.query(sql, input, function (err, result, fields) {
        if (err) throw err;

        // Return whether or not the login credentials were valid
        if (result == ""){
            console.log("Invalid User");
            res.end("fail");
        }
        else{
            res.end("success");
        }
    });

});

// Add new accounts to the database
app.post('/new-user', urlencodedParser, function(req, res){
    var errorString = "";
    var injectCheck = false;

    var inUser = req.body.user;
    var inPassA = req.body.passA;
    var inPassB = req.body.passB;
    console.log("New User Attempt");

    // Check if the password is valid
    if(inPassA == ""){
        errorString += "- Must enter a password<br>"
    }
    else if(inPassA.length < 8){
        errorString += "- Password is less than 8 characters<br>";
    }
    if(inPassA != inPassB){
        errorString += "- Passwords do not match<br>";
    }
    if(inPassA.includes("=") || inPassA.includes("\"") || inPassA.includes("\'")){
        errorString += "- Password contains invalid characters<br>";
        injectCheck = true;
    }

    // Check to see if the username is valid
    if(inUser == ""){
        errorString += "- Must enter a username<br>"
    }
    if(inUser.includes("=") || inUser.includes("\"") || inUser.includes("\'")){
        errorString += "- Username contains invalid characters<br>";
        injectCheck = true;
    }

    // Dont send the input to the database if it contains invalid characters
    if(!injectCheck){

        // Check to see if the account already exists
        var input = [inUser];
        var sql = "SELECT username FROM userTable WHERE EXISTS (" 
                + "SELECT username FROM userTable WHERE "
                + "username = ?);";
        con.query(sql, input, function(err, result, fields){
            if(err) throw (err);

            // If the username is already being used, add that to the error string
            if(result != ""){
                errorString += "- Username is not available<br>";
            }
        
            // If there are no errors, create the account
            if(errorString == ""){
                input = [inUser, inPassA];
                sql = "INSERT INTO userTable (username, pass) "
                    + "VALUES (?, ?);";
                con.query(sql, input, function (err, result, fields) {
                    if (err) throw err;
                });
                res.end("success");
            }

            // Else, return the error string
            else{
                res.end(errorString);
            }
        });
    }
    else{
        res.end(errorString);
    }
});

// Add a new palate to the database
app.post("/new-palate", urlencodedParser, function(req, res){
    inUser = req.body.user;
    inName = req.body.name;
    console.log("New Palate Attempt: " + inName);

    add_palate(inUser, inName);
    res.end("success");
    
});

// Populate the list of existing palates in the save/load menus
app.post("/populate-palate-list", urlencodedParser, function(req, res){
    var inUser = req.body.user;
    var output = {palateArray: []};

    var input = [inUser];
    var sql = "SELECT palate_name FROM palateTable "
            + "WHERE user_id = (SELECT user_id FROM userTable "
            + "WHERE username = ?);";
    con.query(sql, input, function(err, result, fields){
        if(err) throw(err);

        console.log("Polulate Palate List: ");
        for(i = 0; i < result.length; i++){
            console.log(result[i].palate_name);
            output.palateArray.push(result[i].palate_name);
        }
        res.end(JSON.stringify(output));
    });
});

// Save the current Palate
app.post("/save-palate", urlencodedParser, function(req, res){
    inUser = req.body.user;
    inPalate = req.body.palate;
    inColors = (JSON.parse(req.body.colors)).colorArray;
    console.log("Save Palate Attempt: " + inPalate);
    console.log(inColors);

    //Creat the palate if it doesn't exist
    var sql = "SELECT palate_id FROM palateTable "
            + "WHERE palate_name= ? " 
            + "AND user_id=(SELECT user_id FROM userTable "
                         + "WHERE username = ? );";
    var input = [inPalate, inUser];
    con.query(sql, input, function(err, result, fields){
        if(err) throw(err);

        console.log(result);
        // If the palate doesn't exist
        emptyArray = []
        if(result == emptyArray){
            console.log("Creating " + inPalate);
            add_palate(inUser, inPalate);
        }
        else{
            console.log(inPalate + " already exists");
        }
        // Clear all of the colors that used to belong to the palate being saved
        //      Then add the new colors to the color table
        var sql = "DELETE FROM colorTable "
                + "WHERE palate_id=(SELECT palate_id FROM palateTable "
                                 + "WHERE palate_name= ? " 
                                 + "AND user_id = (SELECT user_id FROM userTable "
                                                + "WHERE username = ?));";
        var input = [inPalate, inUser];
        con.query(sql, input, function(err, result, fields){
            if(err) throw(err);
            sql = "INSERT INTO colorTable (color_value, palate_id) VALUES ";
            input = [];
            for(i = 0; i < inColors.length; i++){
                if(i != 0){
                    sql += ", ";
                }
                input.push(inColors[i]);
                input.push(inPalate);
                input.push(inUser);
                sql += "( ? , (SELECT palate_id FROM palateTable "
                            + "WHERE palate_name = ? "
                            + "AND user_id = (SELECT user_id FROM userTable "
                                            + "WHERE username = ? )))";
            }
            sql += ";";
            con.query(sql, input, function(err, result, fields){
                if(err) throw(err);
        
                res.end(inPalate);
            });
        });
    });
});

// Load Existing Palate
app.post("/load-palate", urlencodedParser, function(req, res){
    inUser = req.body.user;
    inPalate = req.body.palate;
    output = {outColors: []};
    console.log("Load Palate Attempt: " + inPalate);

    console.log("Loading: " + inPalate);

    var input = [inPalate, inUser];
    var sql = "SELECT color_value FROM colorTable "
        + "WHERE palate_id=(SELECT palate_id FROM palateTable "
                         + "WHERE palate_name = ? " 
                         + "AND user_id=(SELECT user_id FROM userTable "
                                        + "WHERE username = ?));";
    con.query(sql, input, function(err, result, fields){
        if(err) throw(err);
        for(i = 0; i < result.length; i++){
            output.outColors.push(result[i].color_value);
        }
        res.end(JSON.stringify(output));
    });
});

// Start a connection to the database
var server = app.listen(8081, function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log("Listening at http://" + host + ":" + port);
});