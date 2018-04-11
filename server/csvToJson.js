//require the csvtojson converter class
var fs = require('fs');
var Converter = require("csvtojson").Converter;
// create a new converter object
var converter = new Converter({});

// call the fromFile function which takes in the path to your
// csv file as well as a callback function
converter.fromFile("./Data.csv",function(err,result){
    // if an error has occured then handle it
    if(err){
        console.log("An Error Has Occured");
        console.log(err);
    }
    // create a variable called json and store
    // the result of the conversion
    var json = result;

    // log our json to verify it has worked
    console.log(json);
    var jsonString = JSON.stringify(json);
    fs.writeFile('sample.json', jsonString,'utf8', function (err) {
        if(err){
            throw err;
        }
    });
});