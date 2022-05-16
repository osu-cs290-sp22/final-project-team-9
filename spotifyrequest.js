const url   = require('url');
const axios = require('axios');

const BASE_ACC_URL   = "https://accounts.spotify.com";
const AUTH_URL       = BASE_ACC_URL + "/authorize";
const AUTH_TOKEN_URL = BASE_ACC_URL + "/api/token"

const BASE_API_URL   = "https://api.spotify.com/v1";


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

        return loginURL;
    },


    GetOAuthToken: async function(payload) {

        const config = {
            "grant_type": payload['grant_type'],
            "code": payload['code'],
            "redirect_uri": payload['redirect_uri'],
            "client_id": payload['client_id'],
            "client_secret": payload['client_secret']
        };

        axios.post(AUTH_TOKEN_URL, authOptions)
            .then(function (response) {
                // console.log('  response.data' + response.data);
                return response.data;
            })
            .catch((err) => {
                console.log('ERR GETTING SPOTIFY ACCESS TOKEN', err);
            });

    }
}
