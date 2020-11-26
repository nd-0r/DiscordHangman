const Discord = require('discord.js');
var auth = require('./auth.json');
const client = new Discord.Client({ autorun: true });
var started = false;
const xmlhttprequest = require('xmlhttprequest');
var word = "parmel";
var blanks = "";
const charGuess = new RegExp("\b[a-z]\b,\d");
const strGuess = new RegExp("^[a-z]+$");
var attempts = 0;
const tries = 6;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    RandomWord();
    console.log(client);
});

client.on('message', msg => {
    if (msg.content.toLowerCase() === "!start") {
        started = true;
        msg.reply("Starting hangman. Reply '!stop' to exit");
    } else if (msg.content.toLowerCase() === "!stop") {
        reset();
        started = false;
    } else if (started) {
        game(msg);
    }
});

function game(msg) {
    var content = msg.content.toLowerCase();
    if (attempts > tries) {
        lose(msg);
    } else if (charGuess.test(content)) {
        const str = content.split(",");
        var letter = str[0];
        var index = str[1];
        if (index < 0 || index > word.length) {
            msg.reply(`Invalid index. Word is length ${word.length}. Try again.`);
        }
        // handle extra guesses later
        if (word.charAt(index) === letter) {
            blanks = blanks.substring(0, index) + letter + blanks.substring(index + 1);
            console.log("Word: " + word + "\nBlanks: " + blanks);
            if (blanks === word) {
                win(msg);
            } else {
                msg.reply("Correct");
                msg.reply(blanks);
                msg.reply(blanks + `\nAttempts left: ${tries - attempts}`);
            }
        } else {
            console.log("Word: " + word + "\nBlanks: " + blanks);
            attempts++;
            msg.reply("Incorrect");
            msg.reply(blanks);
            msg.reply(blanks + `\nAttempts left: ${tries - attempts}`);
        }
	} else if (content.length === word.length && strGuess.test(content)) {
        if (content === word) {
            blanks = word;
            console.log("Word: " + word + "\nBlanks: " + blanks);
            win(msg);
        } else {
            console.log("Word: " + word + "\nBlanks: " + blanks);
            lose(msg);
        }
    } else {
        msg.reply('Make guesses in this format: <letter>,<index> or guess the full word.');
    }
}

function win(msg) {
    msg.reply(`You win!!! The word is: ${word}`);
    reset();
}

function lose(msg) {
    msg.reply(`You lose. The word is: ${word}`);
    reset();
}

function reset() {
    RandomWord();
    attempts = 0;
}

function RandomWord() {
    var requestStr = "http://randomword.setgetgo.com/get.php";
    let xhr = new xmlhttprequest.XMLHttpRequest();
    xhr.open("GET", requestStr, false);
    xhr.send();
    // word = xhr.responseText;
    console.log("Random word:" + word);
    for (var i = 0; i < word.length; i++) {
		blanks += '_';
	}
}

client.login(auth.token);