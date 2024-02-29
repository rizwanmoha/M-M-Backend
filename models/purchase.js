const mongoose = require('mongoose');


const purchaseSchema = new mongoose.Schema({
    userId :{
        type: mongoose.Types.ObjectId,
        ref : 'Users',

    },
    courseId : {
        type: mongoose.Types.ObjectId,
        ref: 'courses'
    },
    teachers : [{
        type: mongoose.Types.ObjectId,
        ref: 'teachers'
    }]

},
    {
        timestamps : true,
    },
    

);


module.exports = mongoose.model('purchase' , purchaseSchema);