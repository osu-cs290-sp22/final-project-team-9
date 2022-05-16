const http = require('http');
const url  = require('url');
const fs   = require('fs');
require('dotenv').config();

const spotifyReq = require('./spotifyrequest.js');

// $PORT, otherwise default 8000
const PORT = process.env.PORT || 8000;

const BOOTSTRAP_DIR = 'node_modules/bootstrap/dist/';
const BOOTSTRAP_JS  = fs.readFileSync(BOOTSTRAP_DIR + 'js/bootstrap.min.js');
const BOOTSTRAP_CSS = fs.readFileSync(BOOTSTRAP_DIR + 'css/bootstrap.min.css');
var   INDEX         = fs.readFileSync('public/index.html');


const server = http.createServer(function (req, res) {
    res.statusCode = 404;
    
    if (req.url == '/' || req.url == '/index.html') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(INDEX);
    }
    else if (req.url == ('/' + BOOTSTRAP_DIR + 'js/bootstrap.min.js')) {
        res.writeHead(200, {'Content-Type': 'text/js'});
        res.write(BOOTSTRAP_JS);
    }
    else if (req.url == ('/' + BOOTSTRAP_DIR + 'css/bootstrap.min.css')) {
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(BOOTSTRAP_CSS);
    }
    else if (req.url == '/auth') {
        let spotifyLoginURL = spotifyReq.GetAuthURL(process.env.CLIENT_ID, ("http://" + req.headers.host + '/callback'));
        res.writeHead(307, {'Location': spotifyLoginURL});
    }
    else if (req.path == '/callback') {
        console.log(" * Callback recieved")
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(INDEX);
    }



    console.log(res.statusCode + " @base " + req.baseURL);
    console.log(res.statusCode + " @ " + req.url);
    res.end();
})

server.listen(PORT, function () {
    console.log("== Server is listening on port " + PORT);
})


