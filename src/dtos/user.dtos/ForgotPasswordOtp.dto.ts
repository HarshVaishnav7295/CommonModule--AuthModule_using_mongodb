import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ForgotPasswordOtpDto{
    @ApiProperty({example:"example@gmail.com"})
    @IsString()
    email: string 
}