const teacherSchema = require('../models/teacher.js');
const coursesSchema = require('../models/course.js');
const categorySchema = require('../models/category.js');
const sectionSchema = require('../models/sections.js');
const videoSchema = require('../models/videos.js');
const commentSchema = require('../models/comment.js')
const cloudinary = require("cloudinary").v2;
const Multer = require("multer");
const bodyParser = require("body-parser");


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });

  const apiSecret = cloudinary.config().api_secret;
  
  
  function handleUploadVideo(file) {
    try{
      cloudinary.uploader.upload (file, {
        resource_type: 'image'
      }).then((res) => {
        console.log(res);
        return res;
      });
    } catch (e){
      console.log(e);
    }
  }


exports.getSignature = async (req,res) => {
     

  const timestamp = Math.round((new Date).getTime()/1000);

  const signature = cloudinary.utils.api_sign_request({
    timestamp: timestamp,
    folder: 'MastersOfMusic'}, apiSecret);
  
    res.send({signature, timestamp});


//     upload(req, res, async (err) => {
//       if (err) {
//         return res.json({ errors: err });
//       }
//     try {
//         const b64 = Buffer.from(req.file.buffer).toString("base64");
//         let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
//         const cldRes = await handleUploadVideo(dataURI);
//         res.json(cldRes);
//       } catch (error) {
       
//         res.send({
//           message: error.message,
//         });
//       }


//     res.send({message: "Video Uploaded"})

// })
}

exports.getCourseDescription = async (req,res) => {
  try{
    const {courseId} = req.params;
    const course = await coursesSchema.findById(courseId).populate([{path :'category'},{path: 'teacher', 
    select: '-password' },{path: 'sections'}]);
    if(!course){
      return res.status(404).send({success: false, message: "Course not found"});
    }
    return res.status(200).send({success: true, message: "Course fetched successfully", course});
  } catch(e){
    console.log(e);
    return res.status(500).send({success: false, message: "Error while fetching course"});
  }

}

exports.getCourseInfo = async (req,res) => {
    try{
        const {courseId} = req.params;
        
        const course = await coursesSchema.findById(courseId).populate({path: "sections",
        populate: {path: "videos"}
      })
        

        console.log(course);
        
        if(!course){
            return res.status(404).send({success: false, message: "Course not found"});
        }
        return res.status(200).send({success: true, message: "Course fetched successfully", course});
    } catch (error){
        console.log(error);
        return res.status(500).send({success: false, message: "Error while fetching course"});
    }
}

exports.addComment = async (req,res) => {
  try{
    const {courseId, comment, userId} = req.body;
    const course = await coursesSchema.findById(courseId);
    if(!course){
      return res.status(404).send({success: false, message: "Course not found"});
    }
    
    const newComment = await commentSchema.create({comment, userId, courseId});
    return res.status(200).send({success: true, message: "Comment added successfully"});

  } catch (error){
    console.log(error);
    return res.status(500).send({success: false, message: "Error while adding comment"});
  }
}

exports.getComments = async (req,res) => {
  
  try{
    const {courseId} = req.body;
    const comments = await commentSchema.find({courseId}).populate({
      path: "userId",
      select: "-password -email -wishlist" 
  });
    return res.status(200).send({success: true, message: "Comments fetched successfully", comments});
  } catch (error){
    console.log(error);
    return res.status(500).send({success: false, message: "Error while fetching comments"});
  }
}

exports.createCourse = async (req,res) => {

    try{
      console.log("inside create course");
      console.log(req.body)
        const {title, description, price, category, instructor, teacherId} = req.body;
        // console.log(req.files)
        console.log(req.file.filename)
        const image = req.file.filename
        console.log(image);
        
        const teacher = await teacherSchema.findById(teacherId);
        if(!teacher){
            return res.status(404).send({success: false, message: "Teacher not found"});
        }
        const categoryId = await categorySchema.findOne({name: category})
        console.log("yeh krlo pehle");
        // console.log(categoryId);

        const course = await coursesSchema.create({
            title : title,
            description: description,
            price: price,
            category: categoryId._id,
            teacher: teacherId,
            imageUrl: `http://localhost:8000/images/${req.file.filename}`,
            sections: []
        });

        console.log(course)
        return res.status(200).send({success: true, message: "Course created successfully", course});
    } catch (error){
      console.log(error)
        return res.status(500).send({success: false, message: "Error while creating course"});
    }

}


exports.addSection = async (req,res) => {
    try{
        const {courseId, sectionName} = req.body;
        console.log(courseId);
        const course = await coursesSchema.findById(courseId);
  
        if(!course){
            return res.status(404).send({success: false, message: "Course not found"});
        }
        
        const section = await sectionSchema.create({name: sectionName, videos: []});
        course.sections.push(section);
        await course.save();
        return res.status(200).send({success: true, message: "Section added successfully", section});
    } catch (error){
        return res.status(500).send({success: false, message: "Error while adding section"});
    }
}

exports.editSectionHandler = async (req,res) => {
  try {
    const {sectionId, newName} = req.body;
    const section = await sectionSchema.findById(sectionId);
    if(!section){
      return res.status(404).send({success: false, message: "Section not found"});
    }
    section.name = newName;
    await section.save();
    return res.status(200).send({success: true, message: "Section updated successfully", section});
  } catch (e) {
    console.log(e)
    return res.status(500).send({success: false, message: "Error while updating section"});
  }
}

exports.deleteSectionHandler = async (req,res) => {
  try {
    const {sectionId} = req.body;
    const section = await sectionSchema.findByIdAndDelete(sectionId);
    if(!section){
      return res.status(404).send({success: false, message: "Section not found"});
    }
    return res.status(200).send({success: true, message: "Section deleted successfully"});
  } catch (e){
    console.log(e)
    return res.status(500).send({success: false, message: "Error while deleting section"});
  }
}



exports.addVideoContent = async (req,res) => {
    try{
        const {sectionId, videoName, videoUrl} = req.body;

        const [section, vid] = await Promise.all([
          sectionSchema.findById(sectionId),
          videoSchema.create({name: videoName, url: videoUrl})
      ]);
      
        
        if(!section){
            return res.status(404).send({success: false, message: "Section not found"});
        }

        section.videos.push(vid);
        
        await section.save();
        console.log(section)
        return res.status(200).send({success: true, message: "Video added successfully", vid});
    } catch (error){
        console.log(error)
        return res.status(500).send({success: false, message: "Error while adding video"});
    }
}

exports.deleteVideoContent = async (req,res) => {
  try {
    const {videoId} = req.body;
    const video = await videoSchema.findByIdAndDelete(videoId);
    if(!video){
      return res.status(404).send({success: false, message: "Video not found"});
    }
    return res.status(200).send({success: true, message: "Video deleted successfully"});
  } catch (e){
    console.log(e)
    return res.status(500).send({success: false, message: "Error while deleting video"});
  }
}

exports.editVideoTitleHandler = async (req,res) => {
  try {
    const {lessonId, newName} = req.body;
    const video = await videoSchema.findById(lessonId);
    if(!video){
      return res.status(404).send({success: false, message: "Video not found"});
    }
    video.name = newName;
    await video.save();
    return res.status(200).send({success: true, message: "Video updated successfully", video});
  } catch (e) {
    console.log(e)
    return res.status(500).send({success: false, message: "Error while updating video"});
  }


}


exports.getCourse = async(req , res) =>{
  try{
    const id = req.params.id;
    const cid = id.slice(1);
   
    const course = await coursesSchema.findById(cid);
    
    return res.status(200).send({success : true , message : "Course Details" , course});

  }
  catch(error){
      return res.status(500).send({success : false , message : "Internal server error" });
  }

}