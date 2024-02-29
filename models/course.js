const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
    },

    teacher: [{
        type: Schema.Types.ObjectId, 
        ref: 'teachers',
        required: [true , "Teacher Id is required"] ,

    }],

    category: {
        type : Schema.Types.ObjectId,
        ref : 'categorys',
        required: [true , "Category is required"],
    },
    description: {
        type: String,
        required : [true , "Description is required"],
    },
    imageUrl :{
        type : String,
    },
    
    price: {
        type: String,
        required: true,
    },
    
    sections : [{
        type : mongoose.Types.ObjectId,
        ref:'sections',

    //    required:[true , 'Sections are required'], 
    }],

    totalVideos : {
        type : Number,
        default : 0,
    },

    ratings :{
        type : Number,
        default : 0,
    },

    purchases : {
        type : Number,
        default : 0,
    }
    ,
    quizes :[
        {
            type : mongoose.Types.ObjectId,
            ref : 'quizes',
        }
    ]
    

    
},
    {
        timestamps : true,
    }

)



module.exports = mongoose.model("courses", courseSchema);
