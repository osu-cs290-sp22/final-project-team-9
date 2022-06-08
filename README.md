# CS 290 Final Project

## Setup

1. Run the command `npm install` to install all project dependencies.
2. Copy ".env.example" to ".env" in the same directory.
3. Fill ".env" with the proper API keys.

**Note:** API keys should not be published in this repository, so make sure your ".env" is not getting picked up by git. The gitignore is configured to handle this as long as the file is named properly.

## Usage
1. To start the server, run `node express.js`. To start the server as a background service, run `pm2 start express.js`. To start the server as a cluster, run `pm2 start ecosystem.config.js`
2. Access the server at `http://localhost:8000` or your environment defined address and port.
