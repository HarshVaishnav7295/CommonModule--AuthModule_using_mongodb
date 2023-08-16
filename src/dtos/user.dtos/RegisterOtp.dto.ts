import { ApiProperty } from "@nestjs/swagger"
import { IsString,IsEmail } from "class-validator"

export class RegisterOtpDto{
    @ApiProperty({example:"example@gmail.com"})
    @IsString()
    email: string 
}