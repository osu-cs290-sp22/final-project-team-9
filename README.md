# CS 290 Final Project

This branch containes the serverless distribution designed to run on Cloudflare Workers / Cloudflare Pages.

## Setup
1. Setup a Cloudflare Key-Value store with the name `SMARTLISTS`
1. Run the command `npm install` to install all project dependencies.
2. Edit `_worker.js` and fill in lines 1 - 5 (lines 3 - 5 not necessary if set inside of Cloudflare Workers environment variables).


**Note:** API keys should not be published in this repository, so make sure your API keys are not included in `_worker.js` when publishing commits to this repository.

## Usage
1. To start the development server, run `npm run serve`.
