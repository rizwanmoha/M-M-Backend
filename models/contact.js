const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const contactUs = new Schema({
  firstName: { type: String, required: true},
  lastName:{type: String },
  email: { type: String, required: true },
  message: { type: String, required: true },
  
});

module.exports = mongoose.model('contactUs', contactUs);