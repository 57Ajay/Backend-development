import express from 'express';
import { config } from 'dotenv';
config();

const app = express();
const port = process.env.PORT;

app.get('/', (req, res)=>{
    res.send('hello World');
});

app.listen(port, ()=> 
    {console.log(`Listening on port ${port}`)}
);
