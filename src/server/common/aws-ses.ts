// aws-ses.js
import * as AWS from "aws-sdk";
import * as nodemailer from "nodemailer";

type EmailData = {
  phone_number: string;
  name: string;
}

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "ap-southeast-1",
});
AWS.config.getCredentials(function (error) {
  if (error) {
    console.log(error.stack);
  }
});
const ses = new AWS.SES({ apiVersion: "2010-12-01" });

// change this to the "to" email that you want
const adminMail = "hustlermyteam@gmail.com";
const toMail = "hustlermyteam@gmail.com";
// Create a transporter of nodemailer
const transporter = nodemailer.createTransport({
  SES: ses,
});

export const sendMail = async (emailData: EmailData) => {
  try {
    const mailTemplate = `
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body>
<div style="padding:20px;">
<div style="max-width: 500px;">
<h2>LEADS MASUK</h2>
<p>Hi there Mahdi,</p>
<h3>${emailData.name} - ${emailData.phone_number}</h3>
<p>Berminat untuk membeli :D terima kasih</p>
</div>
</div>
</body>
</html>`;
    const response = await transporter.sendMail({
      from: adminMail,
      to: toMail,
      cc: "farhanhlmy@gmail.com",
      subject: "LEADS MASUK",
      html: mailTemplate
    });
    return response?.messageId
      ? { ok: true }
      : { ok: false, msg: "Failed to send email" };
  } catch (error: any) {
    console.log("ERROR", error.message);
    return { ok: false, msg: "Failed to send email" };
  }
};