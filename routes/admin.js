const passwordHash = require("password-hash");
const async = require('async');
const config = require('../config/index.js');
const mongoModels = require("../mongoModels/index")();
const Admin = mongoModels.admin();
const User = mongoModels.user();

module.exports = () => {
  var result = {};

  result.registration = async (req, res) => {
    console.log(">> Inside adminRegistration.");

    var email = (req && req.body && req.body.email) ? req.body.email : '';
    var mobileNumber = (req && req.body && req.body.mobileNumber) ? req.body.mobileNumber : '';
    var password = (req && req.body && req.body.password) ? req.body.password : '';

    let adminExist = await Admin.findOne({
      email: email
    });

    if (adminExist) {
      return res.json({
        success: false,
        message: "Email Allready Exists."
      });
    }
    const hashedPassword = passwordHash.generate(password);
    const admin = new Admin({
      email: email,
      mobileNumber: mobileNumber,
      password: hashedPassword
    });

    let newAdmin = await admin.save();
    if (!newAdmin) {
      return res.json({
        success: false,
        message: "Error In Admin Registration."
      });
    }

    res.json({
      success: true,
      message: "Admin Registration Successfully.",
      data: newAdmin
    });
  };

  result.login = async (req, res) => {
    console.log(">> Inside admin login.");

    var email = (req && req.body && req.body.email) ? req.body.email : '';
    var password = (req && req.body && req.body.password) ? req.body.password : '';

    if (email == undefined || email == "") {
      return res.json({
        success: false,
        message: "Email Not Defined."
      });
    }
    if (password == undefined || password == "") {
      return res.json({
        success: false,
        message: "Password Not Defined."
      });
    }

    let adminExist = await Admin.findOne({
      email: email
    });

    if (adminExist) {
      var newHashPass = passwordHash.verify(password, adminExist.password);
 
      if (newHashPass == true) {
        res.json({
          success: true,
          data: adminExist,
          message: 'Admin Successfully Login.'
        });
      } else {
        res.json({
          success: false,
          message: "Incorrect Password."
        });
      }
    } else {
      res.json({
        success: false,
        message: "Admin Not Register."
      });
    }
  };
  
  result.adminPageData = async (req, res) => {
    console.log(">> Inside adminPageData.");

    let usersData = await User.find({
      "loanApproval" : false
    }).select('-_id').lean();

    if (usersData) {
      return res.json({
        success: true,
        message: "Successfully getting all non approved loans user data.",
        data:usersData
      });
    } else {
      res.json({
        success: false,
        message: "Error getting non approved users loans."
      });
    }  
  };
  result.approvedLoanByAdmin = async (req, res) => {
    console.log(">> Inside approvedLoanByAdmin.");
    console.log(req.body.email)

    if (req && req.body && req.body.email) {
      var updateQuery = {$set: { "loanApproval": true }};

      let updateUser = await User.update({
        email: req.body.email
      }, updateQuery);

      console.log(req.body.email)

      if (updateUser) {
        res.json({
          success: true,
          message: "Successfully update user data for loan."
        });
      } else {
          res.json({
          success: false,
          message: "Error updating user for loans."
          });
        }
      } else {
        res.json({
          success: false,
          message: "Email not defined."
      });
    }
  };

  return result;
};