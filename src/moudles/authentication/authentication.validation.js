import {z} from "zod"
import { GenderEnum } from "../../common/enum/user.gender.js"
import { generalValidation } from "../../common/validation.js"
import { Role } from "../../common/enum/role.js"
export const loginschema =(lang)=>{
    return z.strictObject({
    email:generalValidation.email(lang),
    password:generalValidation.password(lang)
})
}

export const login=(lang)=>{
    return z.object({
    body:loginschema(lang),
    query:z.strictObject({
        lang:z.enum(["ar","en"]).default("ar")
    })
})
}
export const signup =(lang)=>{
    return  z.object({
    body: loginschema(lang)
        .safeExtend({
            username: generalValidation.username(lang),
            phone: generalValidation.phone(lang),
            confirmPassword:generalValidation.password(lang),
        })
        .superRefine((data, ctx) => {

           generalValidation.matchFields({orginal:"password",copy:"confirmPassword",data,ctx,lang})


            if (!data.username.includes(" ")) {
                ctx.addIssue({
                    code: "custom",
                    path: ["username"],
                    message: "username must be contain space"
                })
            }

        })
})
}


export const confirmEmail=(lang)=>{
    return z.object({
    body:z.strictObject({
        otp:generalValidation.otp(lang),
        email:generalValidation.email(lang)
    })
   
})
}

export const resendconfirmEmail=(lang)=>{
    return z.object({
    body:z.strictObject({
        email:generalValidation.email(lang)
    })
   
})
}

export const twoStepVerification =(lang)=>{
    return z.object({
    body:z.strictObject({
        otp:generalValidation.otp(lang)
    })
   
})
}

export const confirmTwoStepVerification =(lang)=>{
    return z.object({
    body:z.strictObject({
        otp:generalValidation.otp(lang)
    })
   
})
}

export const confirmLoginTwoStepVerification = (lang) => {
  return z.object({
    body: z.strictObject({
      email: generalValidation.email(lang),
      otp: generalValidation.otp(lang),
    }),
  });
};