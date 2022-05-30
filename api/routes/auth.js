const authRouter = require('express').Router();
const auth = require("../controllers/auth.controller.js");

authRouter.get("/session", auth.getSession);
authRouter.get('/refresh', auth.refreshToken)
authRouter.get('/callback', auth.handleCallback);
authRouter.get('/login', auth.login)
authRouter.get('/logout', auth.logout)

module.exports = authRouter;