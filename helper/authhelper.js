const bcrypt = require('bcrypt');


// This function will hash the password through bcrypt module

exports.hashPassword = async(password) =>{

    try{
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password , saltRounds);
        return hashedPassword;
    }catch(error){
        console.log(error);
    }
}


// This function will compare  the password which is stored in the database and the plain text we are getting while login. 

exports.comparePassword = async(password , hashedPassword) =>{
    return bcrypt.compare(password , hashedPassword)
}