import { ApiProperty } from "@nestjs/swagger"

export class IRefreshToken{
    @ApiProperty({example:"true"})
    success : boolean
    @ApiProperty({example:""})
    error : string
    @ApiProperty({example:"ded23423r"})
    accessToken : string

}