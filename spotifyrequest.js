const url = require('url');
const axios = require('axios');
const qs = require('qs');
var randomstring = require("randomstring");

const BASE_ACC_URL = "https://accounts.spotify.com";
const AUTH_URL = BASE_ACC_URL + "/authorize";
const AUTH_TOKEN_URL = BASE_ACC_URL + "/api/token"

const BASE_API_URL = "https://api.spotify.com/v1";


module.exports = {

    // Needs to be supplied the client_id, and where it should redirect back to.
    GetAuthURL: function(challenge) {
        var state = randomstring.generate(16);
        const config = qs.stringify({
            'client_id': process.env.CLIENT_ID,
            'response_type': 'code',
            'redirect_uri': process.env.CALLBACK_URL,
            'scope': 'user-top-read',
            "code_challenge_method": "S256",
            "code_challenge": challenge,
            "state": state,
            "show_dialog": false
        });

        const loginURL = `${AUTH_URL}?${config}`;
        return loginURL;
    },


    GetOAuthToken: async function(code, challenge) {
        const config = qs.stringify({
            "grant_type": 'authorization_code',
            "code": code,
            "redirect_uri": process.env.CALLBACK_URL,
            "client_id": process.env.CLIENT_ID,
            "code_verifier": challenge,
        });

        return new Promise(function(resolve, reject) {

            axios.post(AUTH_TOKEN_URL, config)
                .then(function(response) {
                    resolve(response['data']);
                })
                .catch((err) => {
                    console.log('ERR GETTING SPOTIFY ACCESS TOKEN', err);
                    resolve(err);
                });
        });

    }
}