

const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const teacherSchema = new Schema({
  
  firstName: {type: String,required: true},
  lastName:{type: String,required: true},

  username:{type:String},
 
  email: { type: String, required: true },
  
  password: { type: String, required: true },
  role :{
        type : String,
        default : 'Teacher',
        required : true
      },
  resume : {
      data :Buffer,
      contentType : String,
  },  
  courses : [
    {
        type: mongoose.ObjectId,
        ref: "courses",
    },
],

location:{
  type:String
},
isApproved :{
  type : Boolean,
  default : false,
},

description : {
  type : String
},
education :{
  type : String
},

postGraduation:{
  type:String
},
master:{
  type:String
},
experience:{
  type:String
},
achievement:{
  type:String
},
avatar: {
  url: { type: String },
  public_id: { type: String },
},

createdAt: {
  type: Date,
  default: Date.now,
},

});




module.exports =  mongoose.model('teachers', teacherSchema);