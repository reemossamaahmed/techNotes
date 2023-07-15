const UserModel = require('../model/user');

const _ = require('lodash')

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')


const showUsers = async (req, res) => {
    try{
        const users = await UserModel.find({});
        if(!users){
            return res.status(404).json({
                message : `No users Found`
            })    
        }

        res.status(200).json({
            data : users,
            message: 'success'
        })
    }
    catch(error)
    {
        res.status(500).json({
            message : error.message
        })
    }
}

const showUserById = async (req, res) => {
    try{
        const id = req.params.id;
        const user = await UserModel.find({_id : id});
        if(!user){
            return res.status(404).json({
                message : `This user is not exists`
            })    
        }

        res.status(200).json({
            data : user,
            message: 'success'
        })
    }
    catch(error)
    {
        res.status(500).json({
            message : error.message
        })
    }
}

const createUser = async (req, res) => {
    try{
        let user = await UserModel.findOne({username : req.body.username})
        
        if(user) return res.status(400).send('This UserName exist before')
        user = new UserModel(_.pick(req.body,['username' , 'password', 'roles', 'active']));

        user.password = await bcrypt.hash(user.password, 10)

        const userSave = await user.save();
        const token = user.generateTokens();
        res.status(201).header('x-auth-token',token).json({
            data : _.pick(userSave,['_id','username' , 'roles' , 'active']),
            message: "New User created successfully"
        })
    }
    catch(error)
    {
        res.status(500).json({
            message : error.message
        })
    }
}

const login = async (req, res)=>{
    try{
        let user = await UserModel.findOne({username : req.body.username})

        if(!user)
        {
            return res.status(404).send('Invalid UserName or Password')
        }
        const isValidPassword = await bcrypt.compare(req.body.password, user.password)
        
        if(!isValidPassword)
        {
            return res.status(404).send('Invalid Username or Password')
        }

        const token = user.generateTokens();

        res.json({token : token, user : user})
    }
    catch(error)
    {
        res.status(500).json({
            message : error.message
        })
    }
}

const profile = async(req, res) => {
    const profile = await UserModel.findById(req.user._id).select('-password')
    res.json({data : profile})
}


const updateUser = async (req, res) => {
    try{
        const id = req.params.id;
        
        if(!id){
            return res.status(404).json({
                message : `This User  id is not exists`
            })    
        }

        const user = await UserModel.findByIdAndUpdate({_id : id},req.body,{
            new : true ,
            runValidators :true
        });
        

        res.status(200).json({
            data : user,
            message: 'success'
        })
    }
    catch(error)
    {
        res.status(500).json({
            message : error.message
        })
    }
}

const deleteUser = async (req, res) => {
    try{
        const id = req.params.id;
        
        if(!id == null){
            return res.status(404).json({
                message : `This User  id is not exists`
            })    
        }

        const user = await UserModel.findByIdAndDelete({_id : id});
        console.log(user)
        res.status(200).json({
            data : user,
            message: 'User deleted successfully'
        })
    }
    catch(error)
    {
        res.status(500).json({
            message : error.message
        })
    }
}




const logout = async (req,res)=>{
    try {
        if(req.headers && req.headers['x-token']){
            const token =(req.headers['x-token']).split(' ')[0]
            if (!token ) {
                return res.status(401).send('unAuthorization!!')
            }

            const user = await UserModel.findById(req.user._id)
            const tokens = user.tokens
            const restTokens = tokens.filter((tok)=> {tok !== token});
            const refTokens = user.refresh_tokens
            const restRefTokens = refTokens.filter((tok)=> {tok !== token});
            await UserModel.findByIdAndUpdate(req.user._id,{tokens: restTokens,refresh_tokens:restRefTokens})

            res.status(200).json({
                message: "Logout Successfully!"
            })
        }
        
    } catch (error) {
        res.status(400).json({message:error.message})
    }
}





const refreshToken = async (req,res) => {
    try {
        const refreshToken = req.header('x-token');
        
        if (!refreshToken) {
            return res.status(401).json({
            errors: [
                {
                message: "Token not found",
                },
            ],
            });
        }

        const user = await jwt.verify(refreshToken,'refresh_key')
        const {_id,username,roles} = user
        const accessToken = jwt.sign({_id,username,roles},process.env.JWT_SECRET , {expiresIn:'30s'})
        res.json({ accessToken });
    } catch (error) {
        res.status(400).json({message:error.message})
    }
}



module.exports = {showUsers, showUserById ,createUser ,updateUser ,deleteUser, login, profile , logout, refreshToken}