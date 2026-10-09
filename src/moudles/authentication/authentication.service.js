import {
  BadExecption,
  conflictException,
  notFoundException,
  tooManyRequestException,
  unauthorizedException,
} from "../../common/execption/index.js";
import { createOne, findOne } from "../../common/repository/index.js";
import { decrypt, encrypt } from "../../common/security/encryption.js";
import { compare, hash } from "../../common/security/index.js";
import { UserModel } from "../../DB/models/index.js";
import jwt from "jsonwebtoken";
import {OAuth2Client}  from 'google-auth-library';
import { ProviderEnum } from "../../common/enum/provider.enum.js";
import { sendemail, userEmailTrialsOtpKey, userOtpKey } from "../../common/utlis/email/send.email.js";
import bcrypt from "bcrypt";
import { createCredintialsLogin, createToken } from "../../common/security/token.security.js";
import { ACCESS_TOKEN_EXPIRES_IN,REFRESH_TOKEN_EXPIRES_IN, WEB_CLIENT_IDS } from "../../config.js";
import { emailEvent } from "../../common/events/email.event.js";
import { EmailSubject } from "../../common/enum/email.enum.js";
import { createOTP } from "../../common/utlis/email/otp.js";
import { set,get, del, ttl, incrBy, expire, keys } from "../../common/services/cache.services.js";


export const sendEmailotp=async({email,subject,expiresIn=120,maxTrials=3,blockInSeconds=300})=>{ // function send email with otp 
  const exisitOTP_ttl=await ttl({key:userOtpKey({email,subject})})
  if(exisitOTP_ttl>0){
    throw conflictException(`sorry we cannot send you new otp while existing one still valid please try again after ${exisitOTP_ttl} `)
  }
  const old_trials = await get({
  key: userEmailTrialsOtpKey({ email, subject })
}) ?? 0

if (old_trials >= maxTrials) {
  const trialsTTL = await ttl({
    key: userEmailTrialsOtpKey({ email, subject })
  })

  throw tooManyRequestException(
    `max otp trials has been reached, try again after ${trialsTTL} seconds`
  )
}
  const currentTrials=await incrBy({key:userEmailTrialsOtpKey({email,subject})})

if(currentTrials==3){
  await expire({key:userEmailTrialsOtpKey({email,subject}),ttl:blockInSeconds})
}
  const otp=createOTP()
  await set({key:userOtpKey({email,subject}),
     value:await hash(otp.toString()),
    ttl:expiresIn
  })
   emailEvent.emit("sendEmail",{
    recipent:{
      to:email,
    
    },
    subject,
    data:{code:otp}
   })
   return
}
export const signup = async ({ email, password, username, phone,role }) => {
  const duplicateEmail = await findOne({
    model: UserModel,
    filter: { email },
    options: {
      select: "email",
    },
  });
  if (duplicateEmail) {
    conflictException("email is already exixtts");
  }
  const user = await createOne({
    model: UserModel,

    data: {
      email,
      password: await hash(password),
      username,
      phone: await encrypt(phone),
      role
    },
  });
  await sendEmailotp({email,subject:EmailSubject.CONFIRM_EMAIL})
  return user
};
export const confirmEmail = async ({ email,otp }) => {
  const account = await findOne({
    model: UserModel,
    filter: { email ,
      provider:ProviderEnum.SYSTEM,
      confirmEmail:{$exists:false}
    },
    options: {
      select: "email",
    },
  });
  if (!account) {
    notFoundException("email is not found");
  }
  const hashOTP= await get({key:userOtpKey({email,subject:EmailSubject.CONFIRM_EMAIL})})
  if(!hashOTP || !await compare(otp,hashOTP)){
    throw BadExecption("invalid otp")
  }
  account.confirmEmail=new Date()
  await account.save()
  await del({key:await keys({prefix:userOtpKey({email,subject:EmailSubject.CONFIRM_EMAIL})})})
  return
};

export const resendConfirmEmail = async ({ email }) => {
  const account = await findOne({
    model: UserModel,
    filter: { email ,
      provider:ProviderEnum.SYSTEM,
      confirmEmail:{$exists:false}
    },
    options: {
      select: "email",
    },
  });
  if (!account) {
    notFoundException("email is not found");
  }
  await sendEmailotp({email,subject:EmailSubject.CONFIRM_EMAIL})
  
};

export const confirmLoginTwoStepVerification = async (
  { email, otp },
  issuer
) => {

  const account = await findOne({
    model: UserModel,
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
      twoStepVerification: true,
    },
    options: {
      select: "email twoStepVerification",
    },
  });

  if (!account) {
    throw notFoundException("email is not found");
  }

  const hashOTP = await get({
    key: userOtpKey({
      email: account.email,
      subject: EmailSubject.TWO_STEP_VERIFICATION,
    }),
  });

  if (!hashOTP || !(await compare(otp, hashOTP))) {
    throw BadExecption("invalid otp");
  }

  await del({
    key: userOtpKey({
      email: account.email,
      subject: EmailSubject.TWO_STEP_VERIFICATION,
    }),
  });

  return await createCredintialsLogin({
    user: account,
    issuer,
  });
};




export const login = async ({ email, password }, issuer) => { 
 
  const banKey = `login:ban:${email}`   // key in redis and value true or false if this key found in redis then account banned 
 
  const banTTL = await ttl({ key: banKey }); // time that reminder to key ban to leave after this time you can try again 
 
  if (banTTL > 0) {   //time of ban >0 then there is ban cannot to  
    throw tooManyRequestException( 
      `account is temporarily banned, try again after ${banTTL} seconds` 
    ); 
  } 
 
// no ban you try  
  const account = await findOne({ 
    model: UserModel, 
    filter: { 
      email, 
      provider: ProviderEnum.SYSTEM, 
    }, 
  }); 
 
  if (!account) { //email is false  
 
    const trialsKey = `login:trials:${email}`; // name of key of trials and value is number trials at beggining 0 
 
    const currentTrials = await incrBy({  //incrment the value of key  trialskey  
      key: trialsKey, 
    }); 
 
    if (currentTrials >= 5) { // you use all trials are allowed 
 
      await set({ // we should but key of ban in redis  
        key: banKey, 
        value: "true", 
        ttl: 300, 
      }); 
 
      await del({ 
        key: trialsKey, // trials 0 now  
      }); 
 
      throw tooManyRequestException( 
        "account is temporarily banned for 5 minutes" 
      ); 
    } 
    throw notFoundException("this email is not found"); 
  } 
 
 
  const match = await compare(password, account.password); 
 
 
  if (!match) { 
 
    const trialsKey = `login:trials:${email}`; // name of key of trials and value is number trials at beggining 0 
 
    const currentTrials = await incrBy({//incrment the value of key  trialskey  
      key: trialsKey, 
    }); 
 
    if (currentTrials >= 5) { 
 
      await set({ 
        key: banKey, 
        value: "true", 
        ttl: 300, 
      }); 
      await del({ 
        key: trialsKey, 
      }); 
      throw tooManyRequestException( 
        "account is temporarily banned for 5 minutes" 
      ); 
    } 
    throw unauthorizedException("invalid login"); 
  } 
 
  //you enter data succefully  
 
  const trialsKey = `login:trials:${email}`;  
 
  await del({ 
    key: trialsKey, // we should remove all trials and start with begining 
  }); 

  // check if 2-step verification is enabled
  if (account.twoStepVerification) {

    await sendEmailotp({
      email: account.email,
      subject: EmailSubject.TWO_STEP_VERIFICATION,
    });

    return {
      message: "OTP sent to your email verifiy it",
    };
  }

  return await createCredintialsLogin({ 
    user: account, 
    issuer, 
  }); 
};


const client = new OAuth2Client();
async function verifyGoogleAccount(idToken) {
  const ticket = await client.verifyIdToken({
      idToken,
      audience: WEB_CLIENT_IDS,  
  
  });
  const payload = ticket.getPayload();
  if(!payload.email_verified){
    throw BadExecption("email is not verfied")
  } 
  return payload
  
}



export const signupWithGmail = async ({idToken},issuer) => {
  const {email,name,picture}=await verifyGoogleAccount(idToken) 
  const account=await findOne({
    model:UserModel,
    filter:{email}
  })
  if(account){
    if(account.provider!=ProviderEnum.GOOGLE){
      throw conflictException("this account in system go login by email and password you enterd in system")
    }
    return { status:200,tokens:await createCredintialsLogin({user:account,issuer})}

  }
  const user =await createOne({
    model:UserModel,
    data:{
      username:name,
      email:email,
      image:picture,
      confirmEmail:new Date(),
      provider:ProviderEnum.GOOGLE
    }
  })
  return {status:201,tokens:await createCredintialsLogin({user,issuer})}
  
};




export const forgotPassword=async({email})=>{
  const account = await findOne({
    model: UserModel,
    filter: { email , provider: ProviderEnum.SYSTEM,confirmEmail:{$exists:true}},
    options: {
      select: "email",
    },
  });

  if(!account){
    throw notFoundException("this email is not found"); 
  }
  await sendEmailotp({email,subject:EmailSubject.FORGOT_PASSWORD})
  return  `If the account exists, an OTP will be sent to the email.`


}

export const ResetPassword=async({email,otp,newPassword})=>{
  const account = await findOne({
    model: UserModel,
    filter: { email , provider: ProviderEnum.SYSTEM,},
    options: {
      select: "email",
    },
  });

  if(!account){
    throw notFoundException("this email is not found"); 
  }
   const hashOTP= await get({key:userOtpKey({email,subject:EmailSubject.FORGOT_PASSWORD})})
  if(!hashOTP || !await compare(otp,hashOTP)){
    throw BadExecption("invalid otp")
  }
  account.password=await hash(newPassword)
  await account.save()
  await del({key:userOtpKey({email,subject:EmailSubject.FORGOT_PASSWORD})})
  return `reset password done`

}