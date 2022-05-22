# CS 290 Final Project

This branch containes the serverless distribution designed to run on Cloudflare Workers / Cloudflare Pages.

## Local Development
1. Run `npm install` to install dependencies.
2. To start the development server, run `npm run serve`.

##  Setup Cloudflare Pages with Functions
1. Setup a Cloudflare Key-Value store with the name `SMARTLISTS` and link it to your Pages project.
2. Edit `_worker.js` and set lines 1 and 2 to the base url of your Cloudflare Pages domain (ex. `https://myproject.pages.dev`).
3. Create 3 new environment variables in Cloudflare Pages:
    - `CLIENT_ID`: Your Spotify API Client ID
    - `CLIENT_SECRET`: Your Spotify API Client Secret
    - `SECRET`: A random string used to encrypt user session IDs
4. Add your Cloudflare Pages url as an authorized redirect URL in the Spotify developed dashboard.
    - If your Cloudflare Pages domain is `https://myproject.pages.dev`, add `https://myproject.pages.dev/api/callback` as your redirect URL.

## Setup Cloudflare Pages with Workers
1. Setup a Cloudflare Key-Value store with the name `SMARTLISTS` and link it to your Workers project.
2. Copy the contents of `_worker.js` to your Cloudflare Worker and set line 1 of the worker to your Cloudflare Pages domain (ex. `https://myproject.pages.dev`) and line 2 to your Cloudflare Worker domain (ex. `https://myworker.org.workers.dev`).
4. Create 3 new environment variables in Cloudflare Workers:
    - `CLIENT_ID`: Your Spotify API Client ID
    - `CLIENT_SECRET`: Your Spotify API Client Secret
    - `SECRET`: A random string used to encrypt user session IDs
5. Add your Cloudflare Workers url as an authorized redirect URL in the Spotify developed dashboard.
    - If your Cloudflare Workers domain is `https://myworker.org.workers.dev`, add `hhttps://myworker.org.workers.dev/api/callback` as your redirect URL.

## Deploy Manually
1. Run `npm run build` to bundle the repo into a zip file (`pages.zip`) to upload to Cloudflare Pages.
2. Upload `pages.zip` to Cloudflare Pages.

## Deploy via GitHub
1. Link this GitHub repo to Cloudflare Pages and commit changes to deploy automatically.

