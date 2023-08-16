import { ApiProperty } from "@nestjs/swagger"
import { IsString,IsEmail } from "class-validator"

export class ForgetPasswordDto{

    @ApiProperty({example:"example@gmail.com"})
    @IsEmail()
    email:string

    @ApiProperty({example:"test@123"})
    @IsString()
    password:string

    @ApiProperty({example:"123456"})
    @IsString()
    otp:string
}