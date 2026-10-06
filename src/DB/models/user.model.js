import mongoose from "mongoose";
import { GenderEnum, Role } from "../../common/enum/index.js";
import { ProviderEnum } from "../../common/enum/provider.enum.js";

const UserSchema=new mongoose.Schema({
    firstName:{
        type:String,
        minLength:2,
        maxLength:25,
        required:true,
    
    },
    LastName:{
        type:String,
        minLength:2,
        maxLength:25,
        required:true,
    },
    email:{
         type:String,
        required:true,
        unique:true
    },
    password:{
         type:String,
        required:function(){
            return this.provider==ProviderEnum.SYSTEM
        }
        
        
        
    },
    gender:{
        type:Number,
        enum:Object.values(GenderEnum),
        default:GenderEnum.MALE
    },role:{
        type:Number,
        enum:Object.values(Role),
        default:Role.USER
    },
    provider:{
        type:Number,
        enum:Object.values(ProviderEnum),
        default:ProviderEnum.SYSTEM
    },
    twoStepVerification: {
        type: Boolean,
        default: false,
    },
  
    phone:String,
    DOB:Date,
    confirmEmail:Date,
    image:String,
    coverImage:[String],
    changeCredintailsTime:Date

},{
    timestamps:true,
    strict:true,
    strictQuery:true,
    validateBeforeSave:true,
    autoIndex:true,
    toJSON:{
        virtuals:true
    },
    toObject:{
        virtuals:true
    },
    
    
})
UserSchema.virtual("username").get(function(){
    return `${this.firstName} ${this.LastName}`
}).set(function(val){
    const[fname,lname]=val.split(" ")
    this.firstName=fname
    this.LastName=lname


})

export const UserModel=mongoose.model.User || mongoose.model("User",UserSchema)