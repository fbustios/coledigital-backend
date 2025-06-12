function verifyRole(roles){
    return((req,res,next)=>{
        if(!roles.includes(req.user.rol)){
            return res.status(403).json({ mensaje: 'Acceso denegado' });
        }
        next();
    })
}

module.exports = verifyRole;