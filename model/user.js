const mongoose = require('mongoose')

const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true},
    password: { type: String, required: true },
    roles: {
        type: [String],
        default: ['Employee']
    },
    active:{
        type:Boolean,
        default:true
    },
    tokens : [{
        type: Object
    }]
})


userSchema.methods.generateTokens = function () {
    const token = jwt.sign({_id : this._id}, process.env.MY_SECRET_KEY)

    return token
}

const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel
