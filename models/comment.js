const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    comment : {
        type : String , 
        required : [true , 'Comment is required'],
    },
    userId :{
        type : mongoose.Types.ObjectId,
        ref : 'Users',
        required : true
    },
    courseId : {
        type : mongoose.Types.ObjectId,
        ref : 'Courses',
        required : true
    }
})

module.exports = mongoose.model('comment', commentSchema);