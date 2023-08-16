import { Injectable } from "@nestjs/common/decorators";
import { InjectModel } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import mongoose, { Model } from "mongoose";
import { Otp } from "src/schemas/otps.schema";
const otpGenerator = require('otp-generator')

@Injectable()
export class OtpService{

    constructor(@InjectModel(Otp.name) private otpModel : Model<Document> ){}

    async generateOtp(data:{
        email : string,
        length : number,
        isDigitsAllowed:boolean,
        isLowerCaseAlphabetsAllowed:boolean,
        isUppercaseAlphabetsAllowed:boolean,
        isSpecialCharsAllowed:boolean
    }){
        try{
            console.log("otp called")
            const otp = otpGenerator.generate(data.length,{
                digits : data.isDigitsAllowed,
                lowerCaseAlphabets : data.isLowerCaseAlphabetsAllowed,
                upperCaseAlphabets : data.isUppercaseAlphabetsAllowed,
                specialChars : data.isSpecialCharsAllowed
            })
            const otpExists = await this.otpModel.findOne({
                email : data.email
            })
            if(otpExists){
                const otpEntry = await this.otpModel.findByIdAndUpdate(new ObjectId(otpExists._id),{
                    otp : otp
                })
            }else{
                const otpEntry = await this.otpModel.create({
                    otp : otp,
                    email : data.email
                })
            }
            return {
                success:true,
                otp : otp,
                error:""
            }
        }catch(error:any){
            console.log("Error->",error)
            return {
                success:false,
                otp : "",
                error:error
            }
        }
    }

    async verifyOtp(data:{email:string,otp:string}){
        try{
            console.log("otp called")
            const otpEntry = await this.otpModel.findOne({
                email : data.email,
                otp : data.otp
            })
            if(otpEntry && otpEntry._id){
                return {
                    success:true,
                    isVerified:true
                }
            }else{
                return {
                    success:true,
                    isVerified:false
                }
            }
        }catch(error:any){
            return {
                success:false,
                error:error,
                isVerified:false
            }
        }
    }
}