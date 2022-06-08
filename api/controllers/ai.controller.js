const WomboDream = require('dream-api');
const refresh = require('./auth.controller').refresh;

exports.startTask = async(req, res) => {
    let token = await WomboDream.signUp();
    let taskID = await WomboDream.getTaskID(token.idToken);
    let result = await WomboDream.createTask(token.idToken, taskID, req.body.prompt, 1);

    res.json({
        "success": true,
        "code": 200,
        "errors": [],
        "messages": [],
        "result": {
            "taskID": taskID,
            "token": token.idToken,
            "status": result.state
        }
    })
}

exports.checkStatus = async(req, res) => {
    let result = await WomboDream.checkStatus(req.body.token, req.body.task);

    res.json({
        "success": true,
        "code": 200,
        "errors": [],
        "messages": [],
        "result": result
    })
}