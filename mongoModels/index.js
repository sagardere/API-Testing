//Require all modules
const mongoose = require('mongoose');
const user = require('./user');
const admin = require('./admin');

module.exports =  () => {
    const mongoModels = {};

    mongoModels.user =  () => {
        return mongoose.model('user', user);
    };

    mongoModels.admin =  () => {
        return mongoose.model('admin', admin);
    };
    
  return mongoModels;
};