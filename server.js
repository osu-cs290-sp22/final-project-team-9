const http = require('http');
const url = require('url');
const fs = require('fs');
require('dotenv').config();

const spotifyReq = require('./spotifyrequest.js');
const AUTH_TOKEN = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`, 'utf-8').toString('base64');


// $PORT, otherwise default 8000
const PORT = process.env.PORT || 8000;

const BOOTSTRAP_DIR = 'node_modules/bootstrap/dist/';
const BOOTSTRAP_JS = fs.readFileSync(BOOTSTRAP_DIR + 'js/bootstrap.min.js');
const BOOTSTRAP_CSS = fs.readFileSync(BOOTSTRAP_DIR + 'css/bootstrap.min.css');
var INDEX = fs.readFileSync('public/index.html');


const server = http.createServer(function(req, res) {
    res.statusCode = 404;

    var route = new URL(req.url, process.env.CALLBACK_URL);
    var params = route.searchParams;

    console.log(params);

    if (route.pathname == '/' || route.pathname == '/index.html') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(INDEX);
    } else if (route.pathname == ('/assets/js/bootstrap.min.js')) {
        res.writeHead(200, { 'Content-Type': 'text/js' });
        res.write(BOOTSTRAP_JS);
    } else if (route.pathname == ('/assets/css/bootstrap.min.css')) {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.write(BOOTSTRAP_CSS);
    } else if (route.pathname == '/auth') {
        let spotifyLoginURL = spotifyReq.GetAuthURL(process.env.CLIENT_ID, process.env.CALLBACK_URL);
        res.writeHead(307, { 'Location': spotifyLoginURL });
    } else if (route.pathname == '/callback') {
        console.log(" * Callback recieved")
        const callbackCode = params.get('code');
        var token = spotifyReq.GetOAuthToken(callbackCode);


        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(INDEX);
    }

    console.log(res.statusCode + " @ " + route.pathname + " " + params);
    res.end();
})

server.listen(PORT, function() {
    console.log("== Server is listening on port " + PORT);
})