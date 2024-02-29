
const JWT = require('jsonwebtoken');
const userModel =  require('../models/user.js');

exports.requireSignIn = async(req , res , next) =>{
    try{
        console.log(req.headers)
        const decode = JWT.verify(req.headers.authorization , process.env.JWT_SECRET);
        req.user = decode;
        next();
    }
    catch(error){
        res.status(401).send({
            success: false,
            error, 
            message: 'Unauthorized Access',
        })
        console.log(error);
    }
}

exports.isAdmin = async (req , res , next) =>{
    try{
        const user = await userModel.findById(req.user._id);
        if(user.role!=="Admin"){
            return res.status(401).send({
                success: false,
                message : 'Unauthorized Access'
            })
        }
        else{
            next();
        }
    }catch(error){
        console.log(error);
        res.status(401).send({
            success: false,
            error, 
            message: 'Error in Admin  middleware',
        })
    }
}