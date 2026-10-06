import jwt from "jsonwebtoken"
import { findById, findOneAndUpdate ,findOne} from "../../common/repository/index.js"
import { UserModel } from "../../DB/models/user.model.js"
import { conflictException, notFoundException ,BadExecption} from "../../common/execption/index.js"
import { createCredintialsLogin, createRevokeToken, revokeTokenKey, userBaserevokeTokenKey, verifiyToken } from "../../common/security/token.security.js"
import { decrypt } from "../../common/security/encryption.js"
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from "../../config.js"
import { get, keys, set,del } from "../../common/services/cache.services.js"
import { LogoutEnum } from "../../common/enum/security.enum.js"
import { sendEmailotp } from "../authentication/authentication.service.js"
import { EmailSubject } from "../../common/enum/email.enum.js"
import { compare } from "../../common/security/hash.security.js"
import { userOtpKey } from "../../common/utlis/email/send.email.js"
import { ProviderEnum } from "../../common/enum/provider.enum.js"
export const profile=async(account)=>{
        account.phone=await decrypt(account.phone)

    return account
   

}

export const updateuser=async(id,input)=>{
    const userafterupdate=await findOneAndUpdate({
        model:UserModel,
        filter:{
            _id:id
        },
        update:{
            ...input
        }

    })
    return userafterupdate
}

export const rotateToken=async(payload,user,issuer)=>{
    const accessExpireIn=(payload.iat + ACCESS_TOKEN_EXPIRES_IN)*1000
    const currentTime=Date.now()+(5*6000)
    if(currentTime<accessExpireIn){
        throw conflictException("sorry we cannot create credintials while current access token still within  valid time range ")
    }
    const data= await createCredintialsLogin({user,issuer})
    await createRevokeToken({payload})
    return data
}

export const logout=async(payload,user,{action=LogoutEnum.DEVICE})=>{

    switch (action) {
        case LogoutEnum.ALL:
            user.changeCredintailsTime=new Date()
            await user.save()
            await del({key:await keys({prefix:userBaserevokeTokenKey({userId:payload.sub})})})
            
            break;
    
        default:
            await createRevokeToken({payload})
            break;
    }
  
}


export const twoStepVerification = async ({ userId }) => {
  const account = await findOne({
    model: UserModel,
    filter: {
      _id: userId,
      provider: ProviderEnum.SYSTEM,
    },
    options: {
      select: "email",
    },
  });

  if (!account) {
    throw notFoundException("user not found");
  }

  await sendEmailotp({
    email: account.email,
    subject: EmailSubject.TWO_STEP_VERIFICATION
  });

  return;
};

export const confirmTwoStepVerification = async ({ userId, otp }) => {

  const account = await findOne({
    model: UserModel,
    filter: {
      _id: userId,
      provider: ProviderEnum.SYSTEM,
    },
    options: {
      select: "email twoStepVerification",
    },
  });

  if (!account) {
    throw notFoundException("user not found");
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

  account.twoStepVerification = true;

  await account.save();

  await del({
    key: userOtpKey({
      email: account.email,
      subject: EmailSubject.TWO_STEP_VERIFICATION,
    }),
  });

  return;
};



