const jwt = require('jsonwebtoken');


function verifyToken(req, res, next){
    const header = req.headers.authorization;
    const token = header && header.split(' ')[1];
    if(!token){
        return res.status(401).json({message : 'No token provided'});
    }
    jwt.verify(token, 'perro', (err, user) => {
        if(err){
            return res.status(401).json({message : 'No token provided'});
        }
        req.user = user;
        next();
    })

}

module.exports = verifyToken;