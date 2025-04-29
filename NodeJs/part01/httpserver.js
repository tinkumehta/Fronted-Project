import http from 'http'

const port = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
    console.log(req.url);
    
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html')
    res.end('<h1>Hello world </h1> <p>This is my first time creating node server</p>');
})

server.listen(port, () => {
    console.log(`Server is listening on port${port}`);
    
})