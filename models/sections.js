const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    name :{
        type: String,
        required : [true , 'section name is required'],
    },
    // number:{
    //     type: Number,
    //     required: [true, 'section number is required'],
    // },

    videos :[
        {
            type : mongoose.Types.ObjectId,
            ref: 'video',

        }
    ]

});

module.exports = mongoose.model('sections' , sectionSchema);
