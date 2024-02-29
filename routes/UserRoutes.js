const express = require("express");
const app = require("express");
const router = app.Router();







const {InstructorDataController} = require('../controllers/InstructorController.js');
const { AddToWishlist, RemoveWishlist, getWishlist, createQuery, purchaseCourse, updateCourseProgress, getCourseProgress, getYourCourses } = require("../controllers/USerController.js");
const { getTeacherAndCourses } = require('../controllers/TeacherProfileController.js');
const {updateTeacherProfile} = require('../controllers/TeacherEditProfileController.js');
const {dashboardTeacherProfile} = require('../controllers/DashboardTeacherProfileController.js')
const {updateStudentProfile, getStudent} = require('../controllers/StudentEditProfileController');

const { requireSignIn } = require("../middleware/authmiddleware.js");


router.get('/wishlist', getWishlist)
router.get('/your-courses/:id',requireSignIn, getYourCourses);

router.post("/add-to-wl", requireSignIn, AddToWishlist)
router.post("/remove-wishlist", requireSignIn, RemoveWishlist)
router.post("/purchase", requireSignIn, purchaseCourse)


router.post("/contactus",createQuery)
router.get('/instructorData', InstructorDataController);
router.get('/teacher/:id', getTeacherAndCourses);



router.post('/course/progress', updateCourseProgress)
router.post('/course/get-progress', getCourseProgress)
router.post('/course/get-all-progress')



// // img storage path
// const imgconfig = multer.diskStorage({
//     destination:(req,file,callback)=>{
//         callback(null,"./uploads")
//     },
//     filename:(req,file,callback)=>{
//         callback(null,`image-${Date.now()}.${file.originalname}`)
//     }
// });

// // img filter
// const isImage = (req,file,callback)=>{
//     if(file.mimetype.startsWith("image")){
//         callback(null,true)
//     }else{
//         callback(new Error("only images is allow"))
//     }
// }


router.put('/teachereditprofile/:id',updateTeacherProfile);

router.get('/dashboardteacherprofile/:id', dashboardTeacherProfile);

router.put('/studenteditprofile/:id',updateStudentProfile);

router.get('/studentprofile/:id', getStudent);

module.exports = router;