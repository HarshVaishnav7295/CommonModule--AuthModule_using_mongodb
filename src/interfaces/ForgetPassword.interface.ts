import { ApiProperty } from "@nestjs/swagger"

export class IForgetPassword{
    @ApiProperty({example:"true"})
    success : boolean
    @ApiProperty({example:"Password updated"})
    message : string
}