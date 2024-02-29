const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        const conn = mongoose.connect(process.env.MONGO_URL);
        console.log('connection established');
    }
    catch (error) {
        console.log('Error occured');
    }

}
module.exports = connectDb;