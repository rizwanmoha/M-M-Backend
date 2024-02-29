const express = require("express");
const { getSignature, createCourse, getCourseInfo, addSection, addVideoContent, editSectionHandler, deleteSectionHandler, deleteVideoContent, editVideoTitleHandler, getCourseDescription, addComment, getComments , getCourse } = require("../controllers/CoursesController");
const router = express.Router();
const Multer = require("multer");
const bodyParser = require("body-parser");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './images'); // uploads folder where files will be stored
  },
  filename: function (req, file, cb) {
    const fileExt = file.originalname.split(".").pop();
    const filename = `${new Date().getTime()}.${fileExt}`;
    cb(null, filename);
  }
});

// file.fieldname + '-' +  + path.extname

// file.fieldname + '-' + Date.now() + path.extname

const upload = Multer({
  storage: storage
});

console.log("inside course route")


router.get('/get-signature', getSignature);


router.post('/createcourse',(req,res,next)=>{console.log(req.files); next();},upload.single('image'), createCourse);

router.post('/add-comment', addComment);
router.post('/get-comments', getComments)

router.post('/addcontent', addVideoContent);
router.post('/deletevideo', deleteVideoContent);
router.post('/editVideoTitle', editVideoTitleHandler);
router.post('/addsection',  addSection);
router.post('/editsection', editSectionHandler);
router.post('/deletesection', deleteSectionHandler);

router.get('/description/:courseId', getCourseDescription)
router.get('/:courseId', getCourseInfo);

router.get('/singlecourse/:id', getCourse);

module.exports = router;
