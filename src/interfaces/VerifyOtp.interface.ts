import { ApiProperty } from "@nestjs/swagger"

export class IVerifyOtp{
    @ApiProperty({example:"true"})
    success : boolean
    @ApiProperty({example:"Otp verified.!!"})
    message : string
}