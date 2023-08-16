import { ApiProperty } from "@nestjs/swagger"
import { IsString,IsEmail } from "class-validator"

export class RegisterUserDto{
    @ApiProperty({example:"Harsh Vaishnav"})
    @IsString()
    name : string

    @ApiProperty({example:"harshvaishnav@techtic.agency"})
    @IsEmail()
    email:string

    @ApiProperty({example:"tech@1234"})
    @IsString()
    password:string
}