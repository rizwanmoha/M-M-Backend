const userSchema = require("../models/user.js");
const teacherSchema = require("../models/teacher.js");
const adminSchema = require('../models/admin.js');
const { hashPassword, comparePassword } = require("../helper/authhelper.js");
const multer = require("multer");
const JWT = require("jsonwebtoken");
const nodemailer = require('nodemailer');







exports.registerController = async (req, res) => {
  try {

   
    const { firstName, lastName, email, password  } = req.body;
    console.log("here is coming");
    
      if (!firstName || !lastName || !email || !password) {
        return res
          .status(409)
          .send({ success: false, message: "Please fill all the details " });
      }

      const existingUser = await userSchema.findOne({ email: email });

      if (existingUser) {
        return res
          .status(400)
          .send({ success: false, message: "User already exist please login" });
      }
      console.log("first");
      
      const existingTeacher = await teacherSchema.findOne({email : email});
      if (existingTeacher) {
        return res
          .status(400)
          .send({ success: false, message: "User already exist please login" });
      }

      console.log("second");
      
      const hashedPassword = await hashPassword(password);
      const user = new userSchema({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        
      });
      await user.save();
      console.log("third");
      return res
        .status(200)
        .send({ success: true, message: "User Registered Successfully", user });

 
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Error While registering" });
  }
};

exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email)
      let user = await userSchema.findOne({ email }).populate([{path: 'wishlist', populate: {
        path: 'teacher',
        model: 'teachers',
        select: '-password -email -courses -isApproved -role -createdAt -updatedAt -__v'
      }},
      { path: 'courses', populate: {
        path: 'course' , populate: [{
        path: 'teacher',
        model: 'teachers',
        select: '-password -email -courses -isApproved -role -createdAt -updatedAt -__v'
        },{
          path: 'sections',
          model: 'sections'
        }]
      }
    
    }]);
      console.log(user);

      if (user) {
        const check = await comparePassword(password, user.password);
        if (!check) {
          return res
            .status(501)
            .send({ success: false, message: "Your Details didn't match" });
        }
       
        const token = await JWT.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );
        return res
          .status(200)
          .send({
            success: true,
            message: "Sign In successful",
            user , token
          });
      }

     
      console.log("second");

      user = await teacherSchema.findOne({ email });
      if (!user) {

        user = await adminSchema.findOne({email });
        if(!user){
          return res
          .status(404)
          .send({ success: false, message: "User not registered " });
        }

        const check = await comparePassword(password, user.password);
      
      // if (!check) {
      //   return res
      //     .status(400)
      //     .send({ success: false, message: "Your Details didn't match" });
      // }
      user.firstName = "Mohd";
      user.lastName = "Rizwan";
      user.role = "Admin";

      await user.save();

      const token = await JWT.sign(
        { id: user._id, role: "Admin" },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
        user = {firstName : "Mohd" , lastName: "Rizwan" , role :"Admin" , email : "admin@admin.com", id : user._id , wishlist : [] , courses : []};
      console.log("user");
      console.log(user);

      return res
        .status(200)
        .send({
          success: true,
          message: "Login Successfully ",
          user,
          token,
        });



      }
      
      if(user.isApproved===false){
        return res.status(400).send({success : false , message : "Teacher is not approved contact to admin"});
      }

      const check = await comparePassword(password, user.password);
      
      if (!check) {
        return res
          .status(400)
          .send({ success: false, message: "Your Details didn't match" });
      }
      console.log("third");
      const token = await JWT.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
      console.log("fourth");
      return res
        .status(200)
        .send({
          success: true,
          message: "Login Successfully ",
          user,
          token,
        });
    }
   catch (error) {
    console.log(error)
    return res
      .status(500)
      .send({ success: false, message: "Error while login" });
  }
};

exports.googleController = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(req.body);
    const user = await userSchema.findOne({ email: email });
    if (!user) {
      const teacher = await teacherSchema.findOne({ email: email });
      if (!teacher) {
        return res
          .status(401)
          .send({
            success: false,
            message: "User not found with email address",
          });
      }
      const token = await JWT.sign(
        { id: teacher._id, role: teacher.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
      return res
        .status(200)
        .send({
          success: true,
          message: "Sign in Successfull",
          teacher,
          token,
        });
    }

    return;
  } catch (error) {
    return res.status(500).send({success : false , message : "Internal server error"});
  }
};

// exports.forgotPassword = async (req, res) => {
//   try {
//     const { email, password } = req.body;
   
//       const user = await userSchema.find({ email });

//       if (!user) {
//         const teacher = await teacherSchema.find({email});
//         if(!teacher){
//           return res
//           .status(404)
//           .send({
//             success: false,
//             message: "User not found with this email id",
//           });
//         }

//         const hashedPassword = await hashPassword(password);
//         await teacherSchema.findByIdUpdate(
//           user._id,
//           { password: hashedPassword },
//           { new: true }
//         );
//         return res
//         .status(201)
//         .send({ success: true, message: "Password updated successfully", teacher });
        
        
//       }
//       const hashedPassword = await hashPassword(password);
//       await userSchema.findByIdUpdate(
//         user._id,
//         { password: hashedPassword },
//         { new: true }
//       );

//       return res
//         .status(201)
//         .send({ success: true, message: "User updated successfully", user });
//     } 
//    catch (error) {
//     return res
//       .status(500)
//       .send({ success: false, message: "Error while updating the password" });
//   }
// }

exports.forgotPassword = async (req, res) => {
  try {
    console.log("here it comes");
    const { email, password } = req.body;
    
    let user = await userSchema.findOne({ email });
    if (!user) {
      let teacher = await teacherSchema.findOne({ email });
      if (!teacher) {
        return res.status(404).send({
          success: false,
          message: "User not found with this email id",
        });
      }
      const hashedPassword = await hashPassword(password);
      teacher = await teacherSchema.findByIdAndUpdate(
        teacher._id,
        { password: hashedPassword },
        { new: true }
      );
      return res.status(201).send({
        success: true,
        message: "Password updated successfully",
        teacher,
      });
    }

    console.log("first");
    const hashedPassword = await hashPassword(password);
    user = await userSchema.findByIdAndUpdate(
      user._id,
      { password: hashedPassword },
      { new: true }
    );


      console.log("second");
    return res.status(201).send({
      success: true,
      message: "Password updated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error while updating the password",
    });
  }
}

exports.updateProfile = async (req, res) => {
  try {
    const newData = req.body;

    if (req.user.role === "User") {
      const user = await userSchema.findById(req.user._id);
      if (!user) {
        return res
          .status(404)
          .send({ success: false, message: "User Not found" });
      }
      for (const field in newData) {
        if (newData.hasOwnProperty(field) && user[field] !== newData[field]) {
          user[field] = newData[field];
        }
      }
      const updatedUser = await user.save();
      return res
        .status(201)
        .send({
          success: true,
          message: "User updated successfully",
          updatedUser,
        });
    } else {
      const teacher = await teacherSchema.findById(req.user._id);
      if (!teacher) {
        return res
          .status(404)
          .send({ success: false, message: "Teacher Not found" });
      }
      for (const field in newData) {
        if (
          newData.hasOwnProperty(field) &&
          teacher[field] !== newData[field]
        ) {
          teacher[field] = newData[field];
        }
      }
      const updatedUser = await teacher.save();
      return res
        .status(201)
        .send({
          success: true,
          message: "User updated successfully",
          updatedUser,
        });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Error while updating the profile" });
  }
};
