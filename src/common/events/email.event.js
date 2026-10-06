import { EventEmitter } from "node:events"
import { sendemail } from "../utlis/email/send.email.js"
import { confirmEmailTemplate } from "../utlis/email/templates/confirmemail.template.js";
export const emailEvent=new EventEmitter()

emailEvent.on("sendEmail",async({
      recipent,
      subject,
      data
})=>{
   try{
    await sendemail({
      ...recipent,
      subject,
      html:  confirmEmailTemplate({subject,data})
    });

   }catch(error){
    console.log(error)
    console.log("fail to send email")

   }
})