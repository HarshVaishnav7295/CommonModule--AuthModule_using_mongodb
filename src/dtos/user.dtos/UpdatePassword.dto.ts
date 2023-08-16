import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class UpdatePasswordDto{
    
    @IsString()
    @ApiProperty({example:"test@123"})
    oldPassword : string
    
    @IsString()
    @ApiProperty({example:"test@12345"})
    newPassword : string
    
}