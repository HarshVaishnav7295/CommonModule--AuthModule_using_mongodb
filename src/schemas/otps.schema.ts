import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";

@Schema({timestamps:true})
export class Otp{
    @Prop({type:String,required:true})
    otp : string

    @Prop({type:String,required:true})
    email : string
}

export const OtpSchema = SchemaFactory.createForClass(Otp)