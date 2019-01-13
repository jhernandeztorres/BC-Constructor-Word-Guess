const Word = require("./Word.js");
const inquirer = require("inquirer");

const guessTerms = [
    "picard", "riker", "wesley",
    "deana", "geordi", "data",
    "yar", "beverly", "lwaxana",
    "lor", "q", "betazed"
]

let guesses;
let pickedWords;
let word;
let pickedWord;

function init(){
    pickedWords = [];
    console.log(`\n 
-------------------------------------------------------------\n
Welcome to Star Trek - The Next Generation Word Guess \n
-------------------------------------------------------------\n
We are looking for the character names of the main cast. \n`);
playGame();
}

function playGame(){
    console.log("Game Starting!");
    pickedWord = "";
    guesses = 10;
    if(pickedWords.length < guessTerms.length){
        pickedWord = getWord();
    } else {
        console.log("You are a super nerd and that is awesome! You sure do know your Next Generation trivia!");
        tryAgain();
    }
    if(pickedWord){
        word = new Word(pickedWord)
        word.makeLetters();
        makeGuess();
    }
}

function getWord(){
    let rand = Math.floor(Math.random() * guessTerms.length);
    let randomWord = guessTerms[rand];
    if(pickedWords.indexOf(randomWord) === -1){
        pickedWords.push(randomWord);
        return randomWord;
    }else {
        return getWord();
    }
}

function makeGuess(){
    let check = [];
    inquirer.prompt([
        {
            name: "guessedLetter",
            message: word.update() + 
                "\nGuess a letter " + 
                "\nGuesses left " + guesses +
                "\n"
        }
    ])
    .then(data => {
        word.letters.forEach(letter => {
            letter.checkLetter(data.guessedLetter);
            check.push(letter.getCharacter());
        });
        if(guesses > 0 && check.indexOf("_") !== -1){
            guesses--;
            if(guesses === 0){
                console.log("Game over!")
                tryAgain();
            }else {
                makeGuess();
            }
        }else {
            console.log("You guessed it correctly!");
            console.log(word.update());
            playGame();
        }
    })
}

function tryAgain(){
    inquirer.prompt([
        {
            name: "continue",
            type: "list",
            message: "Play again?",
            choices: ["Yes", "No"]
        }
    ])
    .then(data => {
        if(data.continue === "Yes"){
            init();
        } else {
            console.log("Thanks for playing. Have a good day.");
        }
    });
}

init();