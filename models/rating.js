const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    userId :{
        type : mongoose.Types.ObjectId,
        ref : 'Users',
        required :[true , 'UserId is required'],
    },
    courseId :{
        type: mongoose.Types.ObjectId,
        ref : 'courses',
        required : [true , 'CourseId is required'],

    },
    rating:{
        type : Number,
        required : [true , 'Rating is required'],

    }
    


})

module.exports = mongoose.model('rating' , ratingSchema);
