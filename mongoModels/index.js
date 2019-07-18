//Require all modules
const mongoose = require('mongoose'),
    user = require('./user');

var connections = {};

module.exports =  () => {
    var mongoModels = {};
    mongoModels.user =  () => {
        return mongoose.model('user', user);
    };
  return mongoModels;
};