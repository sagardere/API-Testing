const passwordHash = require("password-hash");
const async = require('async');
var puppeteer = require('puppeteer');
const config = require('../config/index.js');
const mongoModels = require("../mongoModels/index")();
const User = mongoModels.user();

module.exports = () => {
  var result = {};

  result.registration = async (req, res) => {
    console.log(">> Inside registration.");

    var dateOfBirth = (req && req.body && req.body.dateOfBirth) ? req.body.dateOfBirth : '';
    var email = (req && req.body && req.body.email) ? req.body.email : '';
    var loanAmount = (req && req.body && req.body.loanAmount) ? req.body.loanAmount : '';
    var mobileNumber = (req && req.body && req.body.mobileNumber) ? req.body.mobileNumber : '';
    var monthlyIncome = (req && req.body && req.body.monthlyIncome) ? req.body.monthlyIncome : '';
    var city = (req && req.body && req.body.city) ? req.body.city : '';
    var loanApproval = false;

    let userExist = await User.findOne({
      email: email
    });

    if (userExist) {
      return res.json({
        success: false,
        message: "Email Allready Exists."
      });
    }

    const user = new User({
      dateOfBirth: dateOfBirth,
      email: email,
      loanAmount: loanAmount,
      mobileNumber: mobileNumber,
      monthlyIncome: monthlyIncome,
      city: city,
      loanApproval: loanApproval
    });

    let newUser = await user.save();
    if (!newUser) {
      return res.json({
        success: false,
        message: "Error In User Registration."
      });
    }

    res.json({
      success: true,
      message: "User Registration Successfully.",
      data: newUser
    });
  };

  result.puppeteerTest = async (req, res) => {
    console.log(">> Inside puppeteerTest.");

    let myFunction = (async (url, cb) => {
      console.log(`Url : ${url}`);
      const browser = await puppeteer.launch({
        headless: true,
       // executablePath: '/usr/lib/node_modules/puppeteer/.local-chromium/linux-609904/chrome-linux/chrome',
        //executablePath: '/home/sagar/workspace/Script/node_modules/puppeteer/.local-chromium/linux-706915',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36');

      try {
        await page.goto(url, {
          timeout: 300000,
          waitUntil: 'networkidle2',
          followRedirect: true
        });
        console.log('Inside condition..');
        await page.waitForSelector('.PdfDownloadButton');
        const e = await page.$('.PdfDownloadButton button');
        await e.click();
        let text = await page.$eval("#link-resolver li .anchor-text", link => link.outerHTML);
        let hasLink = text.includes('View Open Manuscript') ? true : false;

        if (hasLink == true) {
          await browser.close();
          return cb(null, true);
        }
        throw new Error('Condition failed.');

      } catch (err) {
        console.error(err);
        await browser.close();
        return cb(null, false);
      }
    });

    let doiArray = ['http://dx.doi.org/10.1016/j.spa.2014.04.006'];
    async.eachSeries(doiArray, (singleDOi, esCB) => {

      myFunction(singleDOi, (err, result) => {
        console.log(`Url : ${singleDOi}`);
        console.log(`Log: Is link there ? ${result}`);
        esCB(null);
      });
    }, () => {
      console.log('Finished for all dois.')
      res.json({
        success: true,
        data: result
      });
    });

  }
  return result;
};