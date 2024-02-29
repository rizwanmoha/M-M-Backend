const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    userId :{
        type: mongoose.Types.ObjectId,
        ref : 'Users',

    },
    courses: [
        {
            type : mongoose.Types.ObjectId,
            ref : 'courses',
        }
    ],

},
    {
        timestamps : true,
    },
    

);


module.exports = mongoose.model('order' , orderSchema);