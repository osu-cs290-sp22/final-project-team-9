const axios = require('axios');
const qs = require('qs');

const BASE_ACC_URL = "https://accounts.spotify.com";
const AUTH_URL = BASE_ACC_URL + "/authorize";
const AUTH_TOKEN_URL = BASE_ACC_URL + "/api/token"

module.exports = {

    // Needs to be supplied the client_id, and where it should redirect back to.
    GetAuthURL: function() {
        const config = qs.stringify({
            'client_id': process.env.CLIENT_ID,
            'response_type': 'code',
            'redirect_uri': process.env.CALLBACK_URL,
            'scope': 'user-top-read',
            "show_dialog": false
        });

        const loginURL = `${AUTH_URL}?${config}`;
        return loginURL;
    },


    GetOAuthToken: async function(code) {
        const config = qs.stringify({
            "grant_type": 'authorization_code',
            "code": code,
            "redirect_uri": process.env.CALLBACK_URL,
            "client_id": process.env.CLIENT_ID,
            'client_secret': process.env.CLIENT_SECRET,
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
    },

    RefreshToken: async function(token) {
        const config = qs.stringify({
            "grant_type": 'refresh_token',
            "refresh_token": token,
            "client_id": process.env.CLIENT_ID,
            'client_secret': process.env.CLIENT_SECRET,
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