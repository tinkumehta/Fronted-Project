import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send('Server is ready');
});

// get a list of 5 jokes

app.get('/api/jokes', (req, res) => {
 const jokes = [
    {
        id : 1,
        title: 'A joke',
        content: 'This is a joke'
    },
    {
        id : 2,
        title: 'coder',
        content: 'Coder love light mode'
    },
    {
        id : 3,
        title: 'Man',
        content: 'Russina in 6000'
    },
 ];

 res.send(jokes);
});


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server at http://localhost:${port}`);
    
});