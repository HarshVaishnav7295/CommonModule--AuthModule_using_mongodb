import { ApiProperty } from "@nestjs/swagger"
import { IsString,IsEmail } from "class-validator"

export class VerifyOtpDto{
    @ApiProperty({example:"example@gmail.com"})
    @IsString()
    email: string 
    @ApiProperty({example:"12346"})
    @IsString()
    otp: string 
}

