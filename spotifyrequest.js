const url = require('url');

const BASE_ACC_URL = "https://accounts.spotify.com";
const AUTH_URL     = BASE_ACC_URL + "/authorize";

const BASE_API_URL  = "https://api.spotify.com/v1";


module.exports = {

    hello: function() {
        return "Hello";
    },

    // Needs to be supplied the client_id, and where it should redirect back to.
    GetAuthURL: function(client_id, redirect_uri) {
        let payload = {
            'client_id': client_id,
            'response_type': 'code',
            'redirect_uri': redirect_uri,
            'scope': 'user-top-read'
        };

        let loginURL = `${AUTH_URL}?client_id=${payload['client_id']}&response_type=${payload['response_type']}&redirect_uri=` + 
                       `${payload['redirect_uri']}&scope=${payload['scope']}`;

        // console.log("  " + loginURL);
        return loginURL;
    },





}
