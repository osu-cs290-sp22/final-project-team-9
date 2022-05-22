var frontendURL = 'https://smartlists.pages.dev';
var backendURL = "https://smartlists.pages.dev";

async function aesGcmEncrypt(plaintext, SECRET) {
    const pwUtf8 = new TextEncoder().encode(SECRET);
    const pwHash = await crypto.subtle.digest('SHA-256', pwUtf8);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ivStr = Array.from(iv).map(b => String.fromCharCode(b)).join('');
    const alg = { name: 'AES-GCM', iv: iv };
    const key = await crypto.subtle.importKey('raw', pwHash, alg, false, ['encrypt']);
    const ptUint8 = new TextEncoder().encode(plaintext);
    const ctBuffer = await crypto.subtle.encrypt(alg, key, ptUint8);
    const ctArray = Array.from(new Uint8Array(ctBuffer));
    const ctStr = ctArray.map(byte => String.fromCharCode(byte)).join('');
    return btoa(ivStr + ctStr);
}

async function aesGcmDecrypt(ciphertext, SECRET) {
    const pwUtf8 = new TextEncoder().encode(SECRET);
    const pwHash = await crypto.subtle.digest('SHA-256', pwUtf8);
    const ivStr = atob(ciphertext).slice(0, 12);
    const iv = new Uint8Array(Array.from(ivStr).map(ch => ch.charCodeAt(0)));
    const alg = { name: 'AES-GCM', iv: iv };
    const key = await crypto.subtle.importKey('raw', pwHash, alg, false, ['decrypt']);
    const ctStr = atob(ciphertext).slice(12);
    const ctUint8 = new Uint8Array(Array.from(ctStr).map(ch => ch.charCodeAt(0)));
    try {
        const plainBuffer = await crypto.subtle.decrypt(alg, key, ctUint8);
        const plaintext = new TextDecoder().decode(plainBuffer);
        return plaintext;
    } catch (e) {
        throw new Error('Decrypt failed');
    }
}

async function gatherResponse(response) {
    const { headers } = response;
    const contentType = headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        return JSON.stringify(await response.json());
    } else if (contentType.includes('application/text')) {
        return response.text();
    } else if (contentType.includes('text/html')) {
        return response.text();
    } else {
        return response.text();
    }
}

export default {
    async fetch(request, env) {
        const { pathname } = new URL(request.url);
        if (env.SMARTLISTS) {
            var kv = env.SMARTLISTS
        } else {
            var kv = SMARTLISTS
        }

        var CLIENT_ID = env.CLIENT_ID;
        var CLIENT_SECRET = env.CLIENT_SECRET;
        var SECRET = env.SECRET;
        var callbackURL = encodeURIComponent(backendURL);

        if (pathname.startsWith("/api/auth")) {
            return Response.redirect('https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID + '&response_type=code&redirect_uri=' + callbackURL + '%2Fapi%2Fcallback&scope=user-top-read&show_dialog=false', 302);
        }

        if (pathname.startsWith("/api/callback")) {
            const { searchParams } = new URL(request.url)
            let code = searchParams.get('code')
            const init = {
                body: "grant_type=authorization_code&code=" + code + "&redirect_uri=" + callbackURL + "%2Fapi%2Fcallback&client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET,
                method: 'POST',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                },
            };

            const response = await fetch('https://accounts.spotify.com/api/token', init);
            const final = await gatherResponse(response);
            const json = JSON.parse(final)
            if (json.access_token) {
                const qs = "{\"a\":\"" + json.access_token + "\",\"r\":\"" + json.refresh_token + "\"}"
                await kv.put(code, qs, { expirationTtl: 3600 });
            }

            const enc = await aesGcmEncrypt(code, SECRET);

            return new Response(null, {
                status: 302,
                headers: {
                    'Location': frontendURL + '/start',
                    'Set-Cookie': 'sl_session=' + enc + "; Max-Age=3600; SameSite=None; Secure"
                }
            });
        }

        if (pathname.startsWith("/api/verify")) {
            let cookies = request.headers.get('Cookie') || ""
            if (cookies.includes("sl_session=")) {
                const value = `; ${cookies}`;
                const parts = value.split(`; ${"sl_session"}=`);
                if (parts.length === 2) {
                    let cookie = parts.pop().split(';').shift()
                    try {
                        var dec = await aesGcmDecrypt(cookie, SECRET);
                    } catch (e) {
                        return new Response(JSON.stringify({ "valid": false }), {
                            headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': frontendURL, 'Access-Control-Allow-Credentials': true },
                        });
                    }
                    let payload = await kv.get(dec);
                    if (payload !== null) {
                        return new Response(JSON.stringify({ "valid": true }), {
                            headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': frontendURL, 'Access-Control-Allow-Credentials': true },
                        });
                    }
                }
            }
            return new Response(JSON.stringify({ "valid": false }), {
                headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': frontendURL, 'Access-Control-Allow-Credentials': true },
            });
        }

        if (pathname.startsWith("/api/logout")) {
            let cookies = request.headers.get('Cookie') || ""
            if (cookies.includes("sl_session=")) {
                const value = `; ${cookies}`;
                const parts = value.split(`; ${"sl_session"}=`);
                if (parts.length === 2) {
                    let cookie = parts.pop().split(';').shift()
                    try {
                        var dec = await aesGcmDecrypt(cookie, SECRET);
                    } catch (e) {
                        return new Response(null, {
                            status: 302,
                            headers: {
                                'Location': frontendURL + '/',
                                'Set-Cookie': 'sl_session=; Max-Age=0; SameSite=None; Secure'
                            }
                        });
                    }
                    await kv.delete(dec);
                }
            }
            return new Response(null, {
                status: 302,
                headers: {
                    'Location': frontendURL + '/',
                    'Set-Cookie': 'sl_session=; Max-Age=0; SameSite=None; Secure'
                }
            });
        }

        if (pathname.startsWith("/api/token")) {
            let cookies = request.headers.get('Cookie') || ""
            if (cookies.includes("sl_session=")) {
                const value = `; ${cookies}`;
                const parts = value.split(`; ${"sl_session"}=`);
                if (parts.length === 2) {
                    let cookie = parts.pop().split(';').shift()
                    try {
                        var dec = await aesGcmDecrypt(cookie, SECRET);
                    } catch (e) {
                        return new Response(JSON.stringify({}), {
                            headers: { "Content-Type": "application/json" },
                        });
                    }
                    let payload = await kv.get(dec);
                    if (payload !== null) {
                        let rToken = JSON.parse(payload).r

                        const init = {
                            body: "grant_type=refresh_token&refresh_token=" + rToken + "&client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET,
                            method: 'POST',
                            headers: {
                                'content-type': 'application/x-www-form-urlencoded',
                            },
                        };
                        const response = await fetch('https://accounts.spotify.com/api/token', init);
                        const final = await gatherResponse(response);
                        const json = JSON.parse(final)

                        if (json.access_token) {
                            const qs = "{\"a\":\"" + json.access_token + "\",\"r\":\"" + json.refresh_token + "\"}"
                            await kv.put(cookie, qs, { expirationTtl: 3600 });
                        }
                        const newPayload = "{\"a\":\"" + json.access_token + "\"}"

                        return new Response(newPayload, {
                            headers: { "Content-Type": "application/json", 'Set-Cookie': 'sl_session=' + cookie + "; Max-Age=3600; SameSite=None; Secure" },
                        });
                    }
                }
            }
            return new Response(JSON.stringify({}), {
                headers: { "Content-Type": "application/json" },
            });
        }

        if (pathname.startsWith("/api/playlists/featured")) {
            let cookies = request.headers.get('Cookie') || ""
            if (cookies.includes("sl_session=")) {
                const value = `; ${cookies}`;
                const parts = value.split(`; ${"sl_session"}=`);
                if (parts.length === 2) {
                    let cookie = parts.pop().split(';').shift()
                    try {
                        var dec = await aesGcmDecrypt(cookie, SECRET);
                    } catch (e) {
                        return new Response(JSON.stringify({}), {
                            headers: { "Content-Type": "application/json" },
                        });
                    }
                    let payload = await kv.get(dec);
                    if (payload !== null) {
                        let rToken = JSON.parse(payload).r

                        const init = {
                            body: "grant_type=refresh_token&refresh_token=" + rToken + "&client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET,
                            method: 'POST',
                            headers: {
                                'content-type': 'application/x-www-form-urlencoded',
                            },
                        };
                        const response = await fetch('https://accounts.spotify.com/api/token', init);
                        const final = await gatherResponse(response);
                        const json = JSON.parse(final)

                        if (json.access_token) {
                            const qs = "{\"a\":\"" + json.access_token + "\",\"r\":\"" + json.refresh_token + "\"}"
                            await kv.put(cookie, qs, { expirationTtl: 3600 });

                            const { searchParams } = new URL(request.url)
                            let option = searchParams.get('option')

                            var items = [];
                            var count = 0;
                            var max = 0;
                            const init2 = {
                                method: 'GET',
                                headers: {
                                    'Authorization': 'Bearer ' + json.access_token
                                },
                            };
                            var url = 'https://api.spotify.com/v1/browse/featured-playlists';
                            do {
                                var request1 = await fetch(url, init2);
                                var response1 = JSON.parse(await gatherResponse(request1));
                                response1.playlists.items.forEach(element => {
                                    items.push(element);
                                });
                                count += 50;
                                max = response1.total;
                                url = response1.next;
                            } while (count <= max);

                            var result = {
                                "success": true,
                                "code": 200,
                                "errors": [],
                                "messages": [],
                                "result": {
                                    "playlists": items,
                                    "count": items.length
                                }
                            };

                            return new Response(JSON.stringify(result), {
                                headers: { "Content-Type": "application/json", 'Set-Cookie': 'sl_session=' + cookie + "; Max-Age=3600; SameSite=None; Secure" },
                            });
                        }
                    }
                }
            }
            return new Response(JSON.stringify({}), {
                headers: { "Content-Type": "application/json" },
            });
        }

        if (pathname.startsWith("/api/playlists")) {
            let cookies = request.headers.get('Cookie') || ""
            if (cookies.includes("sl_session=")) {
                const value = `; ${cookies}`;
                const parts = value.split(`; ${"sl_session"}=`);
                if (parts.length === 2) {
                    let cookie = parts.pop().split(';').shift()
                    try {
                        var dec = await aesGcmDecrypt(cookie, SECRET);
                    } catch (e) {
                        return new Response(JSON.stringify({}), {
                            headers: { "Content-Type": "application/json" },
                        });
                    }
                    let payload = await kv.get(dec);
                    if (payload !== null) {
                        let rToken = JSON.parse(payload).r

                        const init = {
                            body: "grant_type=refresh_token&refresh_token=" + rToken + "&client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET,
                            method: 'POST',
                            headers: {
                                'content-type': 'application/x-www-form-urlencoded',
                            },
                        };
                        const response = await fetch('https://accounts.spotify.com/api/token', init);
                        const final = await gatherResponse(response);
                        const json = JSON.parse(final)

                        if (json.access_token) {
                            const qs = "{\"a\":\"" + json.access_token + "\",\"r\":\"" + json.refresh_token + "\"}"
                            await kv.put(cookie, qs, { expirationTtl: 3600 });


                            const { searchParams } = new URL(request.url)
                            let option = searchParams.get('option')

                            var items = [];
                            var count = 0;
                            var max = 0;
                            const init2 = {
                                method: 'GET',
                                headers: {
                                    'Authorization': 'Bearer ' + json.access_token
                                },
                            };
                            var url = 'https://api.spotify.com/v1/me/playlists?limit=50';
                            do {
                                var request1 = await fetch(url, init2);
                                var response1 = JSON.parse(await gatherResponse(request1));
                                console.log(response1);
                                response1.items.forEach(element => {
                                    items.push(element);
                                });
                                count += 50;
                                max = response1.total;
                                url = response1.next;
                            } while (count <= max);

                            var names = ["Daily Mix 1", "Daily Mix 2", "Daily Mix 3", "Daily Mix 4", "Daily Mix 5", "Daily Mix 6", "Daily Wellness", "Release Radar", "Discover Weekly", "Your Top Songs 2021", "Your Top Songs 2020", "Your Top Songs 2019", "Your Top Songs 2018", "Your Top Songs 2017", "Your Top Songs 2016"]

                            if (option == 2) {
                                items = items.filter(function(itm) {
                                    return names.indexOf(itm.name) == -1;
                                });
                            } else if (option == 3) {
                                items = items.filter(function(itm) {
                                    return names.indexOf(itm.name) > -1;
                                });
                            } else if (option == 4) {
                                var madeforyou = items.filter(function(itm) {
                                    return names.indexOf(itm.name) > -1;
                                });
                                items = items.filter(function(itm) {
                                    return names.indexOf(itm.name) == -1;
                                });
                                items = madeforyou.concat(items);
                            }
                            var result = {
                                "success": true,
                                "code": 200,
                                "errors": [],
                                "messages": [],
                                "result": {
                                    "playlists": items,
                                    "count": items.length
                                }
                            };

                            return new Response(JSON.stringify(result), {
                                headers: { "Content-Type": "application/json", 'Set-Cookie': 'sl_session=' + cookie + "; Max-Age=3600; SameSite=None; Secure" },
                            });


                        }



                    }
                }
            }
            return new Response(JSON.stringify({}), {
                headers: { "Content-Type": "application/json" },
            });
        }



        if (env.ASSETS) {
            return env.ASSETS.fetch(request);
        } else {
            return new Response(null, {
                status: 302,
                headers: {
                    'Location': frontendURL + '/',
                }
            });
        }
    }
};