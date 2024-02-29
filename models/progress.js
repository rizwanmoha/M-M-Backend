const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    userId :{
        type : mongoose.Types.ObjectId,
        ref : 'Users',
        
        required :[true , 'UserId is required'],
    },
    
    video : {
        type: mongoose.Types.ObjectId,
        ref : 'video',
        required : [true , 'Video is required'],
    },

    isCompleted : {type: Boolean, required: true, default: false}


})

module.exports = mongoose.model('progress' , progressSchema);
