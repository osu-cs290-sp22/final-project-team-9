# CS 290 Final Project

## Setup

1. Run the command `npm install` to install all project dependencies.
2. Run the command `npm run build` to compile the source code.
3. Copy ".env.example" to ".env" in the same directory.
4. Fill ".env" with the proper API keys.

**Note:** API keys should not be published in this repository, so make sure your ".env" is not getting picked up by git. The gitignore is configured to handle this as long as the file is named properly.

## Usage
1. Run one of the following commands to start the server: 
  - As a single process: `npm run start`
  - As a background service: `pm2 start server.js`
  - As a cluster: `pm2 start ecosystem.config.js`
2. Access the server at `http://localhost:8000` or your environment defined address and port.
