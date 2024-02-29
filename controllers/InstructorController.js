const teacherSchema = require('../models/teacher.js');

exports.InstructorDataController = async (req,res) => {
    
    try {
        const teacherData = await teacherSchema.find();
        console.log(teacherData )
    
        if (teacherData.length > 0) {
          res.status(200).json( teacherData );
        } else {
          res.status(404).json({ error: "Teacher data not found" });
        }
      } catch (error) {
        console.error("error: " + error.message);
        res.status(500).json({ error: error.message });
      }

}