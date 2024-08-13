const nodemailer = require("nodemailer");


exports.sendMail= async(options) => { 
const transporter = nodemailer.createTransport({
  service:"gmail",
  auth: {
    user: "from .env",
    pass: "from .env",
  },
});

// async..await is not allowed in global scope, must use a wrapper
const mailOptions = {
  from: 'ahcene farhi', // sender address
  to: options.to, // list of receivers
  subject: options.subject, // Subject line
  text: options.text, // plain text body
}
  // send mail with defined transport object
  return await transporter.sendMail(mailOptions);
}








// const nodemailer = require('nodemailer')


// const sendEmail = async(options) =>{
//    // 1)- Create transporter (service that will send email like "gmail" ,"Mailgun" , "sendGrid")
//    const transporter = nodemailer.createTransport({
//     service:'gmail',
//     auth: {
//       user:process.env.EMAIL_USER ,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   })

//   // 2)- Define email options (from , to , subject , email content)
//   const emailOptions = {
//     from :'E_shop App <farhiahcene2004@gmail.com>',
//     to:options.email,
//     subject:options.subject,
//     text:options.message, 
//   }

//   // 3)- Send email
//   await transporter.sendMail(emailOptions)

// }


// module.exports =sendEmail