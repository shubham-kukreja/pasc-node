const User = require("../models/user");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const Joi = require("@hapi/joi");

const sgMail = require('@sendgrid/mail')

/*
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_SENDER_EMAIL,
        pass: process.env.MAIL_SENDER_EMAIL_PASSWORD
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
});*/
// ===PASSWORD RECOVER AND RESET

function validateRecover(data) {
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .required()
    });
    return schema.validate(data);
}

async function sendResetMail(user, link) {
    /*const mailOptions = {
        from: process.env.MAIL_SENDER_EMAIL, // sender address
        to: user.email, // list of receivers
        subject: "Password change request", // Subject line
        html: `Hi ${user.firstname} \n 
                        Please click on the following <a href=${link}>Link</a> to reset your password. \n\n 
                       If you did not request this, please ignore this email and your password will remain unchanged.\n`
            // html: "<b>Hello world?</b>" // html body
    };

    //   let info = await transporter.sendMail(mailOptions);
    try {
        const promise = await transporter.sendMail(mailOptions);
        // const promise = Promise.reject({msg : "Venugopal"});
        console.log("sending mail", promise);
        return promise;
    } catch (error) {
        console.log("sending mail error", error);
        return error;
    }*/
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: user.email,
        from: process.env.MAIL_SENDER_EMAIL,
        subject: "Password change request",
        html: `Hi ${user.firstname} \n 
        Please click on the following <a href=${link}>Link</a> to reset your password. \n\n 
       If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };
    return sgMail.send(msg);
}

module.exports = {
    sendResetMail
};
module.exports.validateRecover = validateRecover;