const teacherSchema = require('../models/teacher'); 
const courseSchema = require('../models/course'); 

exports.getTeacherAndCourses = async (req, res) => {
  const { id } = req.params;

  try {
    
    const teacher = await teacherSchema.findById(id);
    // console.log("contollerteacher", teacher);

    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    const courses = await courseSchema.find({ teacher: id });
    // console.log("contollercourses", courses);

    res.status(200).json({ teacher, courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
