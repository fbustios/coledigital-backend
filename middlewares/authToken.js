const jwt = require('jsonwebtoken');


function verifyToken(req, res, next){
    const header = req.headers.authorization;
    next()
}

module.exports = verifyToken;