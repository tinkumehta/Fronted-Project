const express = require('express')
const fs = require('fs')
const zlib = require('node:zlib')

const app = express();
const port = 3000;

// stream read (sample.txt) -> Zipper -> fs Write

 fs.createReadStream("./sample.txt").pipe(
    zlib.createGzip().pipe(fs.createWriteStream("./sample.zip"))
 )
// stream

app.get("/", (req, res) => {
    const stream = fs.createReadStream("./sample.txt", "utf-8");
    stream.on("data" , (chunk) => res.write(chunk));
    stream.on("end", () => res.end());
})

app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`);
    
})