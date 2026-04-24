const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.static("public"));

let words = [];
let audios = [];
let mistakes = {};
let currentWord = "";

function loadData() {
    const lines = fs.readFileSync("lists_quizzes/primary_ready.txt", "utf-8").split("\n");

    words = [];
    audios = [];

    lines.forEach(line => {
    if (!line.trim()) return;

    const parts = line.trim().split(" ");

    const id = parts[0];
    const audio = parts[1];
    const word = parts.slice(2).join(" ");

    if (id && audio && word) {
        audios.push(audio);
        words.push(word);
    }
});
}

loadData();

app.get("/next", (req, res) => {
    const i = Math.floor(Math.random() * words.length);

    currentWord = words[i];

    res.json({
        word: currentWord,
        audio: audios[i]
    });
});

app.post("/check", (req, res) => {
    let { user } = req.body;

    user = user.trim();
    const correctWord = currentWord.trim();

    if (user === correctWord) {
        res.json({ correct: true });
    } else {
        mistakes[correctWord] = ""; 
        res.json({ correct: false, answer: correctWord });
    }

    console.log("USER:", user);
    console.log("WORD:", correctWord);
});

app.get("/mistakes", (req, res) => {
    res.json(mistakes);
});

app.listen(3000, "0.0.0.0", () => console.log("i love you 3000"));