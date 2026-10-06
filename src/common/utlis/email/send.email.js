import nodemailer from "nodemailer";
import { APP_EMAIL, APP_PASSWORD } from "../../../config.js";
import { BadExecption } from "../../execption/error.execption.js";

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: APP_EMAIL,
    pass: APP_PASSWORD,
  },
});

export async function sendemail({
  to,
  cc,
  bcc,
  subject,
  text,
  html,
  attachments = [],
}) {
  try {
    if(!to?.length && !cc?.length && !bcc?.length){
        throw BadExecption("invalid recibent")
    }
    if(!html?.length && !text?.length && !attachments?.length){
        throw BadExecption("invalid email contnet")
    }
    const info = await transporter.sendMail({
      from: `"Mazen Nasser" <${APP_EMAIL}>`,
      to,
      cc,
      bcc,
      subject,
      text,
      html,
      attachments,
    });

    console.log("Message sent: %s", info.messageId);

    // Preview URL is only available when using an Ethereal test account
    console.log(
      "Preview URL: %s",
      nodemailer.getTestMessageUrl(info)
    );
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
}

export const userOtpKey=({email,subject})=>{
  return `user with email ${email} ${subject} otp`
}

export const userEmailTrialsOtpKey=({email,subject})=>{
  return `${userOtpKey({email,subject})}::trials `
}