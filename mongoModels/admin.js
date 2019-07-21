const mongoose = require('mongoose');

const user = new mongoose.Schema({
	email:String,
	mobileNumber:String,
	password: String

},{strict:false});


module.exports = user;