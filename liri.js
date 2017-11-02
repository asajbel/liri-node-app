var keys = require("./keys.js");
var request = require("request");
var twitter = keys.twitKeys;
var commands = process.argv[2];
var input = process.argv.slice(3);
console.log(input);
if (input.length !== 0) input = addPluses(input);
console.log(input);

switch (commands) {
	case "my-tweets":
		break;
	case "spotify-this-song":
		break;
	case "movie-this":
		break;
	case "do-what-it-says":
		break;
	default:
}

function addPluses(words) {
	if (words[0].indexOf(" ") >= 0){
		words = words[0].split(" ");
	} 
	var text = words.join("+");
	return text;
}