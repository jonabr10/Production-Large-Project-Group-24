const nodemailer = require("nodemailer");
const { google } = require("googleapis");
let pathBuilder = require('./frontend/src/Path');

require("dotenv").config();

// googleapis credentials
const CLIENT_ID = '817724187788-crtnre3l9af61fsouajbcfaf2kfsrc5s.apps.googleusercontent.com';
const CLIENT_SECRET = '-3TDXi0telH7ylPozPP7GF_6';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04qJVMr85uwIHCgYIARAAGAQSNwF-L9IrytQfQ3P-qH3IXf-am01VXkMJGgSCCW21SpiaVdyrSmdMPLYYLIXi4UsdXxV-zS7NDnI';

// OAuth2 Access
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// oAuth2 access token
const accessToken = oAuth2Client.getAccessToken();

let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        type: 'oauth2',
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
    },
});

// Incoming: email, uniqueString
// Outgoing: account verification email
// Purpose: this is to set hasValidated to true after user clicks on the hyperlink for registration
exports.sendVerification = async function (email, uniqueString) {
    try {
        // the api route contain the route to the api for verify and the uniqueString identifier for a
        // specific user
        var apiRoute = "verify/" + uniqueString;

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: "Health-n-Welness Support Team <" + process.env.EMAIL_USER + ">", // sender address
            to: email,
            subject: "Health-n-Wellness Registration Verification",
            text: "Health-n-Wellness Registration Verification", // plain text body
            html: "<h1>Welcome to the Health-n-Wellness App!</h1><b>Please click on the link to verify your account <a href=" + pathBuilder.buildPath(apiRoute) + "> here </a></b></b>", // html body
        });

        console.log("<emailer> Verification message sent to email: %s : uniqueString: %s : messageId: %s", email, uniqueString, info.messageId);

    } catch (e) {
        console.log("<emailer> error: " + e.message);
    }
}

// Incoming: email, uniqueString
// Outgoing: account reset email
// Purpose: this is to set hasValidated to true after user clicks on the hyperlink for password reset
exports.sendResetRequest = async function (email, uniqueString) {
    // the api route contain the route to the api for verify and the uniqueString identifier for a
    // specific user
    var apiRoute = "reset/" + uniqueString;

    // oAuth2 access token
    // const accessToken = await oAuth2Client.getAccessToken();

    // let transporter = nodemailer.createTransport({
    //     service: "Gmail",
    //     auth: {
    //         type: 'OAuth2',
    //         user: process.env.EMAIL_USER,
    //         pass: process.env.EMAIL_PASSWORD,
    //         clientId: CLIENT_ID,
    //         clientSecret: CLIENT_SECRET,
    //         refreshToken: REFRESH_TOKEN,
    //         accessToken: accessToken
    //     },
    // });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: "Health-n-Welness Support Team <" + process.env.EMAIL_USER + ">", // sender address
        to: email,
        subject: "Health-n-Wellness Password Reset Request",
        text: "Health-n-Wellness Password Reset Request", // plain text body
        html: "<h1>Health-n-Wellness Password Reset Request!</h1><b>Please click on the link to verify your account <a href=" + pathBuilder.buildPath(apiRoute) + "> here </a></b></b>", // html body
    });

    console.log("<emailer> Reset request message sent to email: %s : uniqueString: %s : message.Id: %s", email, uniqueString, info.messageId);
}

exports.testEmail = async function (email) {
    let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Health-n-Wellness Support Team" <Health.n.Wellness.service@gmail.com>', // sender address
        to: email,
        subject: "Email Test: Health-n-Wellness App",
        text: "This is an email test!", // plain text body
        html: "<h1>Health-n-Wellness Email Diagnostic Test!</h1><b>Please click on the link to verify your account <a href=http://localhost:5000/verify/" + email + "> here </a></b>", // html body
    });

    console.log("<emailer> Test message sent to email: %s : message.Id: %s", email, info.messageId);
}
