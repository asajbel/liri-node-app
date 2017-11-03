var keys = require("./keys.js");
var request = require("request");
var Twitter = require("twitter");
var twitter = new Twitter(keys.twitKeys);
var Spotify = require('node-spotify-api');
var spot = new Spotify(keys.spotKeys);
var fs = require("fs");
var command = process.argv[2];
var input = process.argv.slice(3);

if (input.length !== 0) input = addSpaces(input);


if (input.length !== 0) {
  doSomething(command, input);
} else {
  doSomething(command);
}

function doSomething(task, argument = "") {
  write(task + " " + argument);
  switch (task) {
    case "my-tweets":
      if (argument !== "") {
        myTweets(argument);
      } else {
        myTweets();
      }
      break;
    case "spotify-this-song":
      if (argument !== "") {
        spotifyThis(argument);
      } else {
        spotifyThis();
      }
      break;
    case "movie-this":
      if (argument !== "") {
        movieThis(argument);
      } else {
        movieThis();
      }
      break;
    case "do-what-it-says":
    case "trust-me":
      trustMe();
      break;
    default:
  }
}

function addSpaces(words) {
  if (words[0].indexOf(" ") >= 0) {
    words = words[0].split(" ");
  }
  var text = words.join(" ");
  return text;
}

//Doesn't use my twitter. I barely tweet. 
//So here is a way better twitter user Jeff Gerstmann.
//Or you can enter any screen name to get that user.
function myTweets(name = 'jeffgerstmann') {
  var params = { screen_name: name };
  twitter.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error && response.statusCode === 200) {
      var size = tweets.length;
      for (var i = 0; i < size; i++) {
        write("");
        write(tweets[i].text);
      }

    } else {
      return write('Error occurred: ' + error);
    }
  });
}

function spotifyThis(song = "Bohemian+Rhapsody") {
  spot.search({ type: 'track', query: song, limit: 1 }, function(err, data) {
    if (err) {
      return write('Error occurred: ' + err);
    }
    // write("items============================");
    // write(data.tracks.items[0]);
    var info = data.tracks.items[0];
    write("Artists: " + info.artists[0].name);
    write("Name: " + info.name);
    write("Preview Link: " + info.preview_url);
    write("Album: " + info.album.name);
    // var size = data.tracks.items.length;
    // for (var i = 0; i < size; i++) {
    // write(data.tracks.items[i]);
    // }
  });
}

function movieThis(movie = "Blade Runner") {
  var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=full&apikey=40e9cece";
  request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var data = JSON.parse(body);
      write("Title: " + data.Title);
      write("Year: " + data.Year);
      write("IMDB Rating: " + data.Ratings[0].Value);
      write("Rotten Tomatoes Rating: " + data.Ratings[1].Value);
      write("Country: " + data.Country);
      write("Language: " + data.Language);
      write("Plot: " + data.Plot);
      write("Actors: " + data.Actors);
    } else if (error) {
      write(response);
    }
  });
}

function trustMe() {
  fs.readFile("random.txt", "utf8", function(error, data) {

    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return write("Error Occured: " + error);
    }

    var dataArr = data.split(",");

    doSomething(dataArr[0], dataArr[1]);

  });
}

function write(text) {
  var file = "log.txt";
  console.log(text);
  fs.appendFileSync(file, text + "\r\n", "utf8");
}