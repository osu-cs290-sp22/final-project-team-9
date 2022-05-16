const http = require('http');
const fs   = require('fs');

// $PORT, otherwise default 8000
const PORT = process.env.PORT || 8000;

const BOOTSTRAP_JS  = fs.readFileSync('node_modules/bootstrap/dist/js/bootstrap.min.js')
const BOOTSTRAP_CSS = fs.readFileSync('node_modules/bootstrap/dist/css/bootstrap.min.css')
var   INDEX         = fs.readFileSync('public/index.html');


const server = http.createServer(function (req, res) {
    res.statusCode = 404;
    
    if (req.url == '/' || req.url == '/index.html') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(INDEX);
    }
    else if (req.url == ('/' + BOOTSTRAP_JS)) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(BOOTSTRAP_JS)
    }
    else if (req.url == ('/' + BOOTSTRAP_CSS)) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(BOOTSTRAP_CSS)
    }


    console.log(res.statusCode + " @ " + req.url);
    res.end();
})

server.listen(PORT, function () {
    console.log("== Server is listening on port " + PORT);
})
