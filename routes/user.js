var passwordHash = require("password-hash");
var mongoModels = require("../mongoModels/index")();
var User = mongoModels.user();

module.exports = () => {
  var result = {};

  result.registration = (req, res) => {
    console.log(">> Inside registration.");

    var userName = (req && req.body && req.body.name) ? req.body.name : '';
    var email = (req && req.body && req.body.email) ? req.body.email : '';
    var password = (req && req.body && req.body.password) ? req.body.password : '';

console.log(userName +' >> '+ email + +' >> '+ password);

      User.findOne({
        email: email
      }).exec((err, userInfo) => {
        if (userInfo) {
          res.json({
            success: false,
            message: "Email allready exists."
          })
        } else {
          var hashedPassword = passwordHash.generate(password);
          var user = new User({
            userName: userName,
            email: email,
            password: hashedPassword
          });
          //save user information in dbs
          user.save((err, userResult) => {
            // console.log("userResult : " , userResult);
            if (userResult) {
              res.json({
                success: true,
                message: "User Registration Successfully.",
                data: userResult
              });
            } else {
              res.json({
                success: false,
                message: "Error in User Registration."
              });
            }
          }); //save
      }
     }); //findone
     
  };

  result.login = (req, res) => {
    console.log("Inside login");

    var email = req.body.email;
    var password = req.body.password;
    if (email == undefined || email == "") {
      res.json({
        success: false,
        message: "Email not defined."
      });
    } else if (password == undefined || password == "") {
      res.json({
        success: false,
        message: "Password not defined."
      });
    } else {
      User.findOne({
        email: email
      }).exec((err, userInfo) => {
        if (userInfo) {
          var newHashPass = passwordHash.verify(password, userInfo.password);
          if (newHashPass == true) {
            res.json({
              success: true,
              data: userInfo
            });
          } else {
            res.json({
              success: false,
              message: "Incorrect Password.."
            });
          }
        } else {
          res.json({
            success: false,
            message: "Email Not Register Please SignUp.."
          });
        }
      });
    }
  };
  return result;
};
