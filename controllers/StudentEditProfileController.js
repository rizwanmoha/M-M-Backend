const cloudinary = require('cloudinary').v2; 
const userSchema = require('../models/user'); 

cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.APIKEY,
    api_secret: process.env.APISECRET
});

exports.updateStudentProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const newStudentData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,
            location: req.body.location,
            specialization: req.body.specialization,
            bio: req.body.bio,
            genres: req.body.genres,
            upcomingperformance: req.body.upcomingperformance,
        };

        if (req.body.avatar) {
            const student = await userSchema.findById(id);
            // if (teacher.avatar && teacher.avatar.public_id) {
            //     await cloudinary.uploader.destroy(teacher.avatar.public_id);
            // }

            if (student && student.avatar && student.avatar.public_id) {
                await cloudinary.uploader.destroy(teacher.avatar.public_id);
            }

            const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
                folder: "avatars",
                width: 150,
                crop: "scale",
            });

            newStudentData.avatar = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        } else {
            newStudentData.avatar = null;
        }

        const updatedStudent = await userSchema.findByIdAndUpdate(id, newStudentData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        res.status(200).json({
            success: true,
            data: updatedStudent
        });

    } catch (error) {
        console.error("Error updating student profile:", error);
        res.status(400).json({ error: error.message });
    }
};


exports.getStudent = async(req,res) => {
    const { id } = req.params;

    try {
      
      const student = await userSchema.findById(id);
      // console.log("contollerteacher", teacher);
  
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      res.status(200).json({ student });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};
