import http from 'http'
import fs from 'fs'
const port = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
    
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html')
    console.log(req.url);
    if (req.url === '/') {
        res.statusCode = 200;
        res.end('<h1>Hello world </h1> <p>This is my first time creating node server</p>');
    } else if (req.url == '/about'){
        res.statusCode = 200;
        res.end('<h1>Hello I am Tinku </h> <p>I am full stack web develpoer')
    } else if(req.url === '/web'){
        res.statusCode = 200;
        const data = fs.readFileSync('web.html');
        res.end(data.toString())
    }
    
    else {
        res.statusCode = 404;
        res.end('<h1>Not found server </h1>');
    }
   
})

server.listen(port, () => {
    console.log(`Server is listening on port${port}`);
    
})