const cloudinary = require('cloudinary').v2; 
const teacherSchema = require('../models/teacher'); 

cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.APIKEY,
    api_secret: process.env.APISECRET
});

exports.updateTeacherProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const newTeacherData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,
            location: req.body.location,
            description: req.body.description,
            education: req.body.education,
            experience: req.body.experience,
            achievement: req.body.achievement,
        };

        if (req.body.avatar) {
            const teacher = await teacherSchema.findById(id);
            // if (teacher.avatar && teacher.avatar.public_id) {
            //     await cloudinary.uploader.destroy(teacher.avatar.public_id);
            // }

            if (teacher && teacher.avatar && teacher.avatar.public_id) {
                await cloudinary.uploader.destroy(teacher.avatar.public_id);
            }

            const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
                folder: "avatars",
                width: 150,
                crop: "scale",
            });

            newTeacherData.avatar = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        } else {
            newTeacherData.avatar = null;
        }

        const updatedTeacher = await teacherSchema.findByIdAndUpdate(id, newTeacherData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        res.status(200).json({
            success: true,
            data: updatedTeacher
        });

    } catch (error) {
        console.error("Error updating teacher profile:", error);
        res.status(400).json({ error: error.message });
    }
};
