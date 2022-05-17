const url   = require('url');
const axios = require('axios');
const qs    = require('qs');

const BASE_ACC_URL   = "https://accounts.spotify.com";
const AUTH_URL       = BASE_ACC_URL + "/authorize";
const AUTH_TOKEN_URL = BASE_ACC_URL + "/api/token"

const BASE_API_URL   = "https://api.spotify.com/v1";


module.exports = {

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

        return loginURL;
    },


    GetOAuthToken: async function(code) {

        const config = qs.stringify({
            "grant_type": 'authorization_code',
            "code": code,
            "redirect_uri": process.env.CALLBACK_URL,
            "client_id": process.env.CLIENT_ID,
            "client_secret": process.env.CLIENT_SECRET
        });

        axios.post(AUTH_TOKEN_URL, config)
            .then(function (response) {
                return response['data'];
            })
            .catch((err) => {
                console.log('ERR GETTING SPOTIFY ACCESS TOKEN', err);
            });

    }
}

