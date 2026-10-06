import { Router } from "express";
import { profile, rotateToken, updateuser,logout, twoStepVerification, confirmTwoStepVerification } from "./user.service.js";
import { sucessresponse } from "../../common/utlis/success.response.js";
import { authentication, authorization } from "../../middleware/authentication.middleware.js";
import { TokenType } from "../../common/enum/security.enum.js";
import { Role } from "../../common/enum/role.js";
import { processFileMulterUpload, fileValidtion, localFileUpload } from "../../common/utlis/index.js";
import { uploadMiddleware } from "../../middleware/multer.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from "../authentication/authentication.validation.js"

const router=Router()

router.patch("/profile-image",authentication(),
uploadMiddleware({
    multermiddleware:localFileUpload({maxFileSize:2}).single("attach"),
    customPath:"user_mazen",
    validation:fileValidtion.image


}),
async(req , res ,next)=>{
    req.user.image=req.file.FinalPath 
    await req.user.save()
    return sucessresponse({res,data:{user:req.user}})
})

router.get("/",authentication(),async(req , res , next)=>{    //get profile
    const data=await profile(req.user)
    return sucessresponse({res,data})
})

router.patch("/",authentication(),authorization(Role.ADMIN),async(req , res ,next)=>{
    const data=await updateuser(req.user._id,req.body)
    return sucessresponse({res,data})
})

router.post("/rotate-token",authentication(TokenType.REFRESH),async(req , res ,next)=>{
    const data=await rotateToken(req.payload,req.user,`${req.protocol}://${req.host}`)
    return sucessresponse({res,data})
})

router.post("/logout",authentication(),async(req , res ,next)=>{
    const data=await logout(req.payload,req.user,req.body)
    return sucessresponse({res,data})
})

router.post("/2-step-verification",authentication(),async(req , res, next)=>{
    const data=await twoStepVerification({userId:req.user._id})
    return sucessresponse({res,data})
})

router.post("/2-step-verification/confirm",authentication(),validation(validators.confirmTwoStepVerification),
  async (req, res, next) => {

    const data = await confirmTwoStepVerification({
      userId: req.user._id,
      otp: req.body.otp
    });

    return sucessresponse({ res, data });
  }
);






export default router