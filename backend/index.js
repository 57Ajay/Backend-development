import express from 'express';
import { config } from 'dotenv';
config();

const app = express();
const port = process.env.PORT;

const jokes = [
    {
        setup: "Why don't scientists trust atoms?",
        punchline: "Because they make up everything!"
    },
    {
        setup: "Why did the scarecrow win an award?",
        punchline: "Because he was outstanding in his field!"
    },
    {
        setup: "Why don't they play poker in the jungle?",
        punchline: "Too many cheetahs!"
    }
]

app.get('/', (req, res) => {

  res.send('Hello World! This is AJay');
});

app.get('/api/jokes', (req, res) => {
    
    res.send(jokes);
});

app.get('/api/jokes/random', (req, res) => {
    const randomIndex = Math.floor(Math.random() * jokes.length);
    const randomJoke = jokes[randomIndex];
    res.send(randomJoke);
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
