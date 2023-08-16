
import { ApiProperty } from "@nestjs/swagger"
import { IsString,IsEmail } from "class-validator"

export class RefreshTokenDto{

    @ApiProperty({example:"4524323d23ffd"})
    @IsString()
    accessToken:string

}