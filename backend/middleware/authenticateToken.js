const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token  = authHeader?.split(' ')[1];
    if(!token){
        return res.status(401).json({success: false, message: 'Brak tokena JWT'});
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
        if(err) return res.status(401).json({success: false, message: 'Token nieważny'});
        req.user = user;
        next();
    });
}
module.exports = authenticateToken;