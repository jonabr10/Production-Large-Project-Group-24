const nodemailer = require("nodemailer");
require("dotenv").config();

exports.sendVerification = async function (email, uniqueString) {
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
        // TODO: change href server once prod/dev is ready
        html: "<h1>Welcome to the Health-n-Wellness App!</h1><b>Please click on the link to verify your account <a href=http://localhost:5000/verify/" + uniqueString + "> here </a></b>", // html body
    });

    console.log("<emailer> Verification message sent to email: %s : uniqueString: %s", email, uniqueString);
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
