const jwt = require('jsonwebtoken')
const jwtSecret = 'e83569abfff49a75cdc80f17546beb765bec613fb7f9eb88b9377e432c708b1f6250e2'

exports.adminAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if(token){
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if(err){
                return res.status(401).json({message: "Not authorized"})
            } else {
                if(decodedToken.role !== "admin"){
                    return res.status(401).json({message: "Not authorized"})
                } else{
                    next()
                }
            }
        })
    } else{
        return res
        .status(401)
        .json({message: "Not authorized, token not available"})
    }
}

exports.userAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if(token){
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if(err){
                return res.status(401).json({message: "Not authorized"})
            } else {
                if(decodedToken.role !== "Basic"){
                    return res.status(401).json({message: "Not authorized"})
                } else{
                    next()
                }
            }
        })
    } else{
        return res
        .status(401)
        .json({message: "Not authorized, token not available"})
    }
}
