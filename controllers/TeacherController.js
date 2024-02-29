const teacherSchema = require("../models/teacher.js");
const { hashPassword, comparePassword } = require("../helper/authhelper.js");

exports.registerController = async (req, res) => {
    try {
      console.log("here it comes");
      const {
        firstName,
        lastName,
        email,
        password,
        resume,
        postGraduation,
        achievement,
        experience,
        masters,
      } = req.body;
  
      // Check if the teacher already exists with the given email
      const existingTeacher = await teacherSchema.findOne({ email });
  
      if (existingTeacher) {
        return res.status(400).send({ message: 'Teacher with this email already exists.'  , success : false});
      }
  
      // Create a new teacher instance
      const hashedPassword = await hashPassword(password);
      const newTeacher = new teacherSchema({
        firstName,
        lastName,
        email,
        password : hashedPassword,
        resume, // Assuming resume is an object with 'data' and 'contentType'
        postGraduation,
        achievement,
        experience,
        master: masters, // Assuming 'masters' is sent from the frontend
      });
  
      // Save the new teacher to the database
      const savedTeacher = await newTeacher.save();
  
      res.status(201).json({success : true , message : "User Saved " ,savedTeacher });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


  


  exports.listOfTeachers = async(req , res) =>{
      try{
          const teachers = await teacherSchema.find({isApproved : false});

          return res.status(200).send({success : true , message : "List of all Teachers Accept request" , teachers});


      }
      catch(error){
          console.log("Error while getting the list of teachers");

          return res.status(500).send({success : false , message : "Internal server error"});
      }
  }

  exports.getSingleTeacher = async(req , res) =>{

    try{
      const id = req.params.id;
      // console.log(id);
      // console.log(typeof id);
      const teacher = await teacherSchema.findById(id);
      console.log(teacher);

      return res.status(200).send({success : true , message : "teacher details" , teacher});

    }
    catch(error){

        return res.status(500).send({success : false , message : "Internal server error"});
    }

  }

  exports.updateRequest = async (req, res) => {
    try {
      const  id  = req.params.id; // Assuming the teacher ID is passed as a parameter in the request
      // const tid = id.slice(1);
      // console.log(id);
      // console.log(tid);
      // Find the teacher by ID and update the isApproved field to true
      const updatedTeacher = await teacherSchema.findByIdAndUpdate(
        id,
        { isApproved: true },
        { new: true } // Set to true to return the updated document
      );
  
      if (!updatedTeacher) {
        return res.status(404).json({ message: 'Teacher not found' });
      }
  
      res.status(200).json({ message: 'Teacher request updated successfully', teacher: updatedTeacher });
    } catch (error) {
      console.error('Error updating teacher request:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  exports.ignoreRequest = async (req, res) => {
    try {
      const id = req.params.id; // Assuming the teacher ID is passed as a parameter in the request
  
      // Find the teacher by ID and remove it
      const deletedTeacher = await teacherSchema.findByIdAndRemove(id);
  
      if (!deletedTeacher) {
        return res.status(404).json({ message: 'Teacher not found' });
      }
  
      res.status(200).json({ message: 'Teacher request deleted successfully', teacher: deletedTeacher });
    } catch (error) {
      console.error('Error deleting teacher request:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  