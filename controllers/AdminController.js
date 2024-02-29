const contactModel = require("../models/contact.js");

const courseModel = require("../models/course.js");

const teacherModel = require("../models/teacher.js");

const userModel = require("../models/user.js");

const categoryModel = require('../models/category.js');

const purchaseModel = require('../models/purchase.js');

exports.getAllQuery = async (req, res) => {
  try {
    const query = await contactModel.find({});

    return res
      .status(201)
      .send({ success: true, message: "All queryies", query });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Error while querying" });
  }
};

exports.getDetails = async(req , res) =>{

  try {
    const courseCount = await courseModel.countDocuments();
    const contactCount = await contactModel.countDocuments();
    const categoryCount = await categoryModel.countDocuments();
    const userCount = await userModel.countDocuments();

    return res.status(200).json({
      success: true,
      courseCount,
      contactCount,
      categoryCount,
      userCount
    });
  } catch (error) {
    console.error("Error fetching details:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching details"
    });
  }

}

exports.createCategory = async (req, res) => {
  const { name } = req.body;
  try {
      const newCategory = await categoryModel.create({ name });
      return res.status(201).json({ success: true, message: "Category created successfully", category: newCategory });
  } catch (error) {
      console.error("Error creating category:", error);
      return res.status(500).json({ success: false, message: "Error creating category" });
  }
};

exports.getPurchases = async(req , res) =>{
  try {
    const purchases = await purchaseModel.find({})
      .populate({
        path: 'userId',
        select: 'firstName lastName'
      })
      .populate({
        path: 'teachers',
        select: 'firstName lastName'
      })
      .populate({
        path: 'courseId',
        select: 'title'
      });
     

    return res.status(200).json({ success: true, message: "All purchases with populated fields", purchases });
  } catch (error) {
    console.error("Error fetching purchases:", error);
    return res.status(500).json({ success: false, message: "Error fetching purchases" });
  }


}

exports.createQuery = async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body;

    if (!firstName || !lastName || !email || !password || !message) {
      return res
        .status(409)
        .send({ success: false, message: " Please fill all the details" });
    }
    const contact = await new contactModel({
      firstName,
      lastName,
      email,
      message,
    }).save();

    return res
      .status(201)
      .send({ success: true, message: "Query created Successfully", contact });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Error while creating query" });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    return res.status(200).json({ success: true, message: "All categories", categories });
  } catch (error) {
    console.error("Error while querying categories:", error);
    return res.status(500).json({ success: false, message: "Error while querying categories" });
  }
};

exports.deleteCategory = async (req, res) => {
  const categoryId = req.params.id;
  try {
   
    console.log(categoryId);
    const deletedCategory = await categoryModel.findByIdAndDelete(categoryId);
   


    
    return res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    
    return res.status(500).json({ success: false, message: "Error deleting category" });
  }
};

exports.deleteController = async (req, res) => {
  try {
    const id = req.param.id;
    const qid = id.slice(1);
    const query = await contactModel.findByIdAndDelete(id);

    return res
      .status(201)
      .send({ success: true, message: "Query deleted successfully " });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Error while deleting query" });
  }
};

// exports.getAllCourses = async (req, res) => {
//   try {
//     const courses = await courseModel.find({});

//     console.log(courses);
//     consol.log(courses.length);
//     return res
//       .status(201)
//       .send({ success: true, message: "All courses", courses });
//   } catch (error) {
//     return res
//       .status(500)
//       .send({ success: false, message: "Error while getting all courses" });
//   }
// };

exports.deleteCourses = async (req, res) => {
  try {
    const id = req.params.id;
    const cid = id.slice(1);

    const course = await courseModel.findByIdAndDelete(cid);

    return res
      .status(201)
      .send({ success: true, message: "Course Deleted Successfully", course });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Error while deleting the courses" });
  }
};

exports.getAllTeachers = async (req, res) => {
  const { query } = req.query;

  try {
    let result;

    if (query) {
      result = await teacherModel.find({
        $or: [
          { firstName: { $regex: query, $options: "i" } },
          { lastName: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ],
      });
    } else {
      result = await teacherModel.find({});
    }

    return res
      .status(200)
      .send({ success: true, message: "List of Teachers", teachers: result });
  } catch (error) {
    console.error("Error searching users:", error);
    return res
      .status(500)
      .send({
        success: false,
        message: "Error while getting list of teachers",
      });
  }
};

exports.getAllUsers = async (req, res) => {
  const { query } = req.query;

  try {
    let result;

    if (query) {
      result = await userModel.find({
        $or: [
          { firstName: { $regex: query, $options: "i" } },
          { lastName: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ],
      });
    } else {
      result = await userModel.find({});
    }

    return res
      .status(200)
      .send({ success: true, message: "List of Users", users: result });
  } catch (error) {
    console.error("Error searching users:", error);
    return res
      .status(500)
      .send({ success: false, message: "Error while getting list of users" });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const searchQuery = req.query.search;
    console.log(searchQuery);
    // const courses = await courseModel
    //   .find({})
      
    // console.log("comes here");
    // console.log(courses);
    // console.log(courses.length)
    // console.log("comes here");
    let courses;
    if (searchQuery) {
      
      courses = await courseModel.find({
        $or: [
          { title: { $regex: searchQuery, $options: "i" } },
          { description: { $regex: searchQuery, $options: "i" } }
        ]
      });
    } else {
     
      courses = await courseModel.find({});
    }
    return res
      .status(200)
      .send({ success: true, message: "List of courses", courses });  
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Internal server error " });
  }
};
