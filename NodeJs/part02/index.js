const express = require('express')

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello word');
})
app.get('/a', (req, res) => {
    res.send('<h2>A </h2>')
})

app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`);
    
})