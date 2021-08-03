const nodemailer = require("nodemailer");
let pathBuilder = require('./frontend/src/Path');

require("dotenv").config();

exports.sendVerification = async function (email, uniqueString) {
    // the api route contain the route to the api for verify and the uniqueString identifier for a
    // specific user
    var apiRoute = "verify/" + uniqueString;

    let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Health-n-Wellness Support Team" <foo@example.com>', // sender address
        to: email,
        subject: "Health-n-Wellness Registration Verification",
        text: "Health-n-Wellness Registration Verification", // plain text body
        html: "<h1>Welcome to the Health-n-Wellness App!</h1><b>Please click on the link to verify your account <a href=" + pathBuilder.buildPath(apiRoute) + "> here </a></b></b>", // html body
    });

    console.log("<emailer> Verification message sent to email: %s : uniqueString: %s : messageId: %s", email, uniqueString, info.messageId);
}

exports.sendResetRequest = async function (email, uniqueString) {
    // the api route contain the route to the api for verify and the uniqueString identifier for a
    // specific user
    var apiRoute = "reset/" + uniqueString;

    let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Health-n-Wellness Support Team" <foo@example.com>', // sender address
        to: email,
        subject: "Health-n-Wellness Password Reset Request",
        text: "Health-n-Wellness Password Reset Request", // plain text body
        html: "<h1>Health-n-Wellness Password Reset Request!</h1><b>Please click on the link to verify your account <a href=" + "http://localhost:3000/" + apiRoute + "> here </a></b></b>", // html body
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
