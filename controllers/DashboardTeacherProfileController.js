const mongoose = require('mongoose');
const teacherSchema = require('../models/teacher'); 
const courseSchema = require('../models/course'); 
const userSchema = require('../models/user');
const purchaseSchema = require('../models/purchase');
const categorySchema = require('../models/category');
const orderSchema = require('../models/order');
const commentSchema = require('../models/comment');


exports.dashboardTeacherProfile = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    
    const teacher = await teacherSchema.findById(id); 
    // const user = await userSchema.findById(id);
    console.log("contollerteacher", teacher);
    // console.log(user)

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




exports.teacherDashboardStudentList = async(req,res) => {

    const { id } = req.params;

    try {
        
        const purchases = await purchaseSchema.find({ teachers: id });
        const userIds = purchases.map(purchase => purchase.userId);
        const students = await userSchema.find({ _id: { $in: userIds } });
        res.status(200).json({ success: true, students });

      } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
      }

};

exports.deleteTeacherDashboardStudent = async(req,res) => {
    const user = await userSchema.findById(req.params.id);

    if (!user) {
        console.log("Student is not Found!");
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
};


exports.numberOfStudentTeacherDashboard = async(req,res) => {
    const { id } = req.params;

    try {
        
        const purchases = await purchaseSchema.find({ teachers: id });
        const userIds = purchases.map(purchase => purchase.userId);
        const students = await userSchema.find({ _id: { $in: userIds } });

        const numberOfStudents = students.length;
        
        res.status(200).json({ success: true, numberOfStudents });

      } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
      }
};


exports.courseWithCategory = async(req,res) => {
    const { id } = req.params;
    console.log(id);

    try{
        const categories = ["Beginner", "Rock", "Metal", "Blues", "Acoustic", "MusicTheory", "GuitarTone", "GuitarTechnique"];
        const categoryCounts = {};
        let numberOfCourse = 0;
        
        categories.forEach(category => {
            categoryCounts[category] = 0;
        });
        const courses = await courseSchema.find({ teacher: id });
         numberOfCourse = courses.length;
         console.log("number of course", numberOfCourse);
        for (const course of courses) {
            const category = await categorySchema.findById(course.category);
            if (category && category.name in categoryCounts) {
              categoryCounts[category.name]++;
            }
        }

        console.log("course with category",categoryCounts);

        const responseObject = {
            categoryCounts: categoryCounts,
            numberOfCourse: numberOfCourse
        };

        res.status(200).json({ success: true, responseObject });

    }catch(error){
        console.error('Error category counts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.totalEarnedMoney = async(req,res) => {
    const { id } = req.params;
    try{
        const courses = await courseSchema.find({ teacher: id });
        // const courseIds = courses.map(course => course._id);
        // const orders = await orderSchema.find({ 'courses': { $in: courseIds } });
        let totalSellingPrice = 0;
        console.log(courses);

        for(let i =0; i<courses.length; i++){
          totalSellingPrice += courses[i].purchases*(courses[i].price);
        }
        // courses.map((course)=>{
        //   totalSellingPrice += course.purchases*course.price
        //   return course
        // })
        // for (const order of orders) {
        //     for (const courseId of order.courses) {
        //       if (courseIds.includes(courseId)) {
        //         const course = courses.find(course => course._id.equals(courseId));
        //         if (course) {
        //           totalSellingPrice += parseFloat(course.price);
        //         }
        //       }
        //     }
        // }

        res.status(200).json({ success: true, totalSellingPrice });

    }catch(error){
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.studentComment = async(req,res) => {
  const { id } = req.params;

  try{

    const courses = await courseSchema.find({ teacher: id });
    if (!courses.length) {
      return res.status(404).json({ message: 'No courses found for this teacher' });
    }

    const courseIds = courses.map(course => course._id);

    const comments = await commentSchema.find({ courseId: { $in: courseIds } })
                                      .populate('userId')
                                      .exec();

    

    res.status(200).json({ success: true, comments });

  }catch(error){
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
