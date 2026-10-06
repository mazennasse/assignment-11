import jwt from "jsonwebtoken"
import { ACCESS_USER_TOKEN_SIGNTURE,ACCESS_TOKEN_EXPIRES_IN,REFRESH_TOKEN_EXPIRES_IN, ACCESS_ADMIN_TOKEN_SIGNTURE, REFRESH_ADMIN_TOKEN_SIGNTURE,REFRESH_USER_TOKEN_SIGNTURE } from "../../config.js"
import { BadExecption, notFoundException, unauthorizedException } from "../execption/error.execption.js"
import { findById } from "../repository/db.repository.js"
import { UserModel } from "../../DB/models/user.model.js"
import { decrypt } from "./encryption.js"
import { TokenType } from "../enum/security.enum.js"
import { Role } from "../enum/role.js"
import{randomUUID} from "node:crypto"
import { exisits,set } from "../services/cache.services.js"

export const userBaserevokeTokenKey=({userId})=>{
    return `user ::${userId.toString()}::RevokeToken`
}


export const revokeTokenKey=({userId,jti})=>{
    return `${userBaserevokeTokenKey({userId})}::${jti}`
}


export const createToken=async({
    payload={},
    option={},
    secret=ACCESS_USER_TOKEN_SIGNTURE
})=>{
    return jwt.sign(payload,secret,option)

}

export const verifiyToken=async({
    token="",
    secret=ACCESS_USER_TOKEN_SIGNTURE
})=>{
    return jwt.verify(token,secret)

}

export const getFinalSignture=async({tokenType=TokenType.ACCESS,role=Role.USER})=>{
    const signture=await getRoleSignture({role})
    return tokenType==TokenType.ACCESS? signture.accesssignture:signture.refreshsignture

}

export const decodeToken=async({   // verifiy token and return acc and payload
    token="",
    tokenType=TokenType.ACCESS

})=>{
    const decoded=await jwt.decode(token)
    if(!decoded?.aud?.length){
        throw BadExecption("there is no audience")
    }
    const payload= await verifiyToken({token,
        secret:await getFinalSignture({tokenType,role:decoded.aud[0]})
    })
    if(!payload?.sub){
        throw BadExecption("missing id")// sub returned?
    }
    if( await exisits({key:revokeTokenKey({userId:payload.sub,jti:payload.jti})})){
        throw unauthorizedException("expired login credintails")// this account is logout?
    }
    const account=await findById({
        model:UserModel,
        id:payload.sub
    })
    if(!account){
        throw notFoundException("this user is not found")
    }
    if((account.changeCredintailsTime?.getTime() ?? 0)>payload.iat*1000){
        throw unauthorizedException("expired login credintails")// check if time of intiate the token if less than changetimecredintails then this token is invalid and user is logout 
    }
    return {account,payload}


}


export const getRoleSignture=async({role=Role.USER})=>{
    let signture 
    switch (role) {
        case Role.ADMIN:
            signture={accesssignture:ACCESS_ADMIN_TOKEN_SIGNTURE,refreshsignture:REFRESH_ADMIN_TOKEN_SIGNTURE}
            
            break;
    
        default:
            signture={accesssignture:ACCESS_USER_TOKEN_SIGNTURE,refreshsignture:REFRESH_USER_TOKEN_SIGNTURE}

            break;
    }
    return signture
}

export const createCredintialsLogin=async({
    user,
    issuer,
    options={}
})=>{
    const {accesssignture,refreshsignture}=await getRoleSignture({role:user.role})
    const jwtid=randomUUID()
    const access_token=await createToken({
        payload:{sub:user._id},
        
        option:{
           ...options,
           audience:[user.role],
           issuer,
            expiresIn:ACCESS_TOKEN_EXPIRES_IN,
            jwtid
        },
        secret:accesssignture
      })
    
      const refresh_token=await createToken({
        payload:{sub:user._id},
        
        option:{
            ...options,
            audience:[user.role],
            issuer,
            expiresIn:REFRESH_TOKEN_EXPIRES_IN,
            jwtid
            
        },
        secret:refreshsignture
      })
    
      return {access_token,refresh_token}
}



export const authBasic = async ({ email, password }) => {
  const account = await findOne({
    model: UserModel,
    filter: { email },
  });
  if (!account) {
    notFoundException("this email is not found ");
  }
  const match = await compare(password, account.password);
  if (!match) {
    unauthorizedException("invalid login");
  }
  return account
};



export const createRevokeToken=async({payload})=>{
       const consumedTime=(Math.ceil(Date.now()/1000)-payload.iat)
        const refreshTokenExpire=payload.iat+REFRESH_TOKEN_EXPIRES_IN
        const ttl=refreshTokenExpire-consumedTime
        await set({key:revokeTokenKey({userId:payload.sub,jti:payload.jti}) ,value:payload.jti,ttl})
        return
}

