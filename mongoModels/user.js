const mongoose = require('mongoose');

const user = new mongoose.Schema({
	email:String,
	userName:String,
	password: String

},{strict:false});


module.exports = user;