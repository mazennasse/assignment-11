import { TokenType } from "../common/enum/security.enum.js"
import { forbiddenException, unauthorizedException } from "../common/execption/index.js"
import { authBasic, decodeToken } from "../common/security/token.security.js"

export const authentication=(tokenType=TokenType.ACCESS)=>{
    return async(req , res, next)=>{
    const {authorization}=req.headers   //take token from headers
    if(!authorization){
        throw unauthorizedException("unazorithezed")
    }
    const[key,credintal]=authorization.split(" ") ||[]
    switch (key) {
        case "Basic":
            const[email,password]=Buffer.from(credintal,"base64").toString()?.split(":")
            req.user=await authBasic({email,password})
            
            break;
        case "Bearer":   //use method token bearer
            const{account,payload}=await decodeToken({token:credintal,tokenType}) //use function decode that get token and when its valid and all true return payload and account 
            req.user=account //put account in key name user in the req object
            req.payload=payload //put payload in key name payload in the req object
            break;  
    
        default:
            next(new Error("invalid authentication schema ",{cause:{status:400}}))
          
    }
    
    next()

}
}

export const authorization=(accessRole)=>{
  return async(req,res,next)=>{
      if(req.user.role<accessRole){
        throw forbiddenException("there is not allowed for you")
    }
    next()
  }
}