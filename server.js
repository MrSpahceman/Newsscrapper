var cheerio = require("cheerio");
var request = require("request");
const express = require("express"),
    PORT = process.env.PORT || 3000;
var mongoose = require("mongoose");
var app = express();

// First, tell the console what server3.js is doing
console.log("\n******************************************\n" +
    "Look for all headlines in ESPN \n" +
    "one of the pages of awwwards.com. Then,\n" +
    "grab the titles source URL." +
    "\n******************************************\n");
var db = require("./models");

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/", {
    useMongoClient: true
});
// Make request to grab the HTML from awwards's clean website section
request("http://www.espn.com", function(error, response, html) {

    // Load the HTML into cheerio
    var $ = cheerio.load(html);

    // Make an empty array for saving our scraped info
    var results = [];

    // With cheerio, look at each award-winning site, enclosed in "figure" tags with the class name "site"
    $("h1").each(function(i, element) {

        /* Cheerio's find method will "find" the first matching child element in a parent.
         *    We start at the current element, then "find" its first child a-tag.
         *    Then, we "find" the lone child img-tag in that a-tag.
         *    Then, .attr grabs the imgs srcset value.
         *    The srcset value is used instead of src in this case because of how they're displaying the images
         *    Visit the website and inspect the DOM if there's any confusion
         */
        var title = $(element).text();
        //var imgLink = $(element).find("a").find("img").attr("srcset").split(",")[0].split(" ")[0];

        // Push the image's URL (saved to the imgLink var) into the results array
        results.push({
            title: title,
            //link: link
        });
        db.Article
            .create(results)
            .then(function(dbArticle) {
                res.send("Scrape Complete");
            })
            .catch(function(err) {
                res.json(err);
            });
    });

    // After looping through each element found, log the results to the console
    console.log(results);

});
app.listen(PORT, function() {
    console.log('app listening on port ' + PORT);
});