const nodemailer = require("nodemailer");
let pathBuilder = require('./frontend/src/Path');

require("dotenv").config();

// Incoming: email, uniqueString
// Outgoing: account verification email
// Purpose: this is to set hasValidated to true after user clicks on the hyperlink for registration
exports.sendVerification = async function (email, uniqueString) {
    try {
        // the route to the api for verify and the uniqueString identifier for a specific user
        var apiRoute = "verify/" + uniqueString;

        let transporter = nodemailer.createTransport({
            service: "yahoo",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: "Health-n-Welness Support Team <" + process.env.EMAIL_USER + ">", // sender address
            to: email,
            subject: "Health-n-Wellness Registration Verification",
            text: "Health-n-Wellness Registration Verification", // plain text body
            html: "<h1>Welcome to the Health-n-Wellness App!</h1><b>Please click on the link to verify your account <a href=" + pathBuilder.buildPath(apiRoute) + "> here </a></b></b>", // html body
        });

        console.log("<emailer verification> Verification message sent to email: %s : uniqueString: %s : messageId: %s", email, uniqueString, info.messageId);

    } catch (e) {
        console.log("<emailer verification> error: " + e.message);
    }
}

// Incoming: email, uniqueString
// Outgoing: account reset email
// Purpose: this is to set hasValidated to true after user clicks on the hyperlink for password reset
exports.sendResetRequest = async function (email, uniqueString) {
    try {
        // the route to the api for verify and the uniqueString identifier for a specific user
        var apiRoute = "reset/" + uniqueString;

        let transporter = nodemailer.createTransport({
            service: "yahoo",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: "Health-n-Welness Support Team <" + process.env.EMAIL_USER + ">", // sender address
            to: email,
            subject: "Health-n-Wellness Password Reset Request",
            text: "Health-n-Wellness Password Reset Request", // plain text body
            html: "<h1>Health-n-Wellness Password Reset Request!</h1><b>Please click on the link to reset the password of your account <a href=" + pathBuilder.buildPath(apiRoute) + "> here </a></b></b>", // html body
        });

        console.log("<emailer reset> Reset request message sent to email: %s : uniqueString: %s : message.Id: %s", email, uniqueString, info.messageId);

    } catch (e) {
        console.log("<emailer reset> error: " + e.message);
    }
}

// exports.testEmail = async function (email) {
//     let transporter = nodemailer.createTransport({
//         service: "Gmail",
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASSWORD
//         },
//     });

//     // send mail with defined transport object
//     let info = await transporter.sendMail({
//         from: '"Health-n-Wellness Support Team" <Health.n.Wellness.service@gmail.com>', // sender address
//         to: email,
//         subject: "Email Test: Health-n-Wellness App",
//         text: "This is an email test!", // plain text body
//         html: "<h1>Health-n-Wellness Email Diagnostic Test!</h1><b>Please click on the link to verify your account <a href=http://localhost:5000/verify/" + email + "> here </a></b>", // html body
//     });

//     console.log("<emailer> Test message sent to email: %s : message.Id: %s", email, info.messageId);
// }
