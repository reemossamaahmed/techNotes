const UserModel = require('../model/user');
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    const token = req.header('x-auth-token')
    if(!token)
    {
        return res.status(401).json({message : 'You are not Authentication'})
    }
    
    try
    {
        const verfyToken = jwt.verify(token, process.env.MY_SECRET_KEY)
        req.user = verfyToken
        next();
    }
    catch(error)
    {
        res.status(500).json({
            message : error.message
        })
    }
}

module.exports = auth