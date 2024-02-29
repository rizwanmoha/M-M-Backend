const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const userSchema = new Schema({
  
  
    firstName: { type: String, required: true},

    lastName : { type :String , required: true},
    username: {type:String},
    email: { type: String, required: true },
    location:{type:String},
    phone: { type: String },
    password: { type: String, required: true },
    
    role :{
      type : String,
      default : 'User',
      required : true
    },

    avatar: {
      url: { type: String },
      public_id: { type: String },
    },
    specialization:{type:String},
    bio:{type:String},
    genres:{type:String},
    upcomingperformance:{type:String},

    wishlist: [
        {
            type: mongoose.ObjectId,
            ref: "courses",
        },
    ],

    courses : [{
     course : {
        type: mongoose.ObjectId,
        ref: "courses"
      },
      progress : [
        {
          videoId : {
            type : mongoose.ObjectId,
            ref : "videos"
          },
          watched : {
            type : Boolean,
            default : false
          }
        }  
      ]
    }
  ]
},

{
  timestamps: true,
}
);


module.exports = mongoose.model('Users', userSchema);
