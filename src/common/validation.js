import {z} from "zod"
import { GenderEnum } from "./enum/user.gender.js"
import { LanguageEnum } from "./enum/language.enum.js"

export const validationMessage = {

    // username
    102: {
        ar: "عفواا اسم المستخدم يجب ان لا يقل عن حرفين",
        en: "Username must be at least 2 characters"
    },

    103: {
        ar: "عفواا اسم المستخدم يجب ان لا يزيد عن 51 حرف",
        en: "Username must not exceed 51 characters"
    },

    // email
    104: {
        ar: "عفواا يجب ادخال بريد إلكتروني صحيح",
        en: "Please enter a valid email address"
    },

    // password
    105: {
        ar: "عفواا كلمة المرور يجب ان لا تقل عن 8 أحرف",
        en: "Password must be at least 8 characters"
    },

    106: {
        ar: "عفواا كلمة المرور يجب ان لا تزيد عن 16 حرف",
        en: "Password must not exceed 16 characters"
    },

    // phone
    107: {
        ar: "عفواا يجب ادخال رقم هاتف صحيح",
        en: "Please enter a valid phone number"
    },

    // gender
    108: {
        ar: "عفواا النوع غير صحيح",
        en: "Invalid gender"
    },

    // confirm password
    109: {
        ar: "عفواا كلمة المرور وتأكيد كلمة المرور غير متطابقين",
        en: "Password and confirm password do not match"
    },

    // confirm email
    110: {
        ar: "عفواا البريد الإلكتروني وتأكيد البريد الإلكتروني غير متطابقين",
        en: "Email and confirm email do not match"
    },

    // username must contain space
    111: {
        ar: "عفواا اسم المستخدم يجب ان يحتوي على مسافة",
        en: "Username must contain a space"
    },

    // role
    112: {
        ar: "عفواا الدور غير صحيح",
        en: "Invalid role"
    }
}

export const getValidationMessage=(lang,code)=>{
    return lang==LanguageEnum.AR?validationMessage[code].ar :validationMessage[code].en
}


export const matchFields=({orginal,copy,data,ctx,lang})=>{
    if (data[orginal] !== data[copy]) {
                ctx.addIssue({
                    code: "custom",
                    path: [copy],
                    message: lang==LanguageEnum.AR?` ${orginal}و  ${copy} عدم توافق بين `:`missmatch between ${orginal} and ${copy} `
                })
            }

}
export const generalValidation={
    email:(lang)=>z.email({message:getValidationMessage(lang,104)}),
    password:(lang)=>z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%&*^$()]).{8,16}$/,{error:"must follow pattern"}).min(8,{message:getValidationMessage(lang,105)}).max(16,{message:getValidationMessage(lang,106)}),
     username:(lang)=> z.string().min(2,{message:getValidationMessage(lang,102)}).max(51,{message:getValidationMessage(lang,103)}),
    phone: (lang)=>z.e164({message:getValidationMessage(lang,107)}),
    gender:(lang)=>z.enum(GenderEnum,{message:getValidationMessage(lang,108)}),
    otp:(lang)=>z.string().regex(/^\d{6}$/),
    matchFields
}