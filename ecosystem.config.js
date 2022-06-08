module.exports = {
    apps: [{
        script: 'server.js',
        watch: '.',
        name: 'smartlists',
        instances: 0,
        exec_mode: "cluster"
    }],

    deploy: {
        production: {
            ref: 'origin/master',
            repo: 'osu-cs290-sp22/final-project-team-9',
            path: '.',
            'pre-deploy-local': '',
            'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
            'pre-setup': ''
        }
    }
};