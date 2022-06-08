const aiRouter = require('express').Router();
const ai = require("../controllers/ai.controller");

aiRouter.post("/start", ai.startTask);
aiRouter.post("/check", ai.checkStatus);

module.exports = aiRouter;