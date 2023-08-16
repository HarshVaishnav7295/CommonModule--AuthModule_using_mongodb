import { ApiProperty } from "@nestjs/swagger"

export class ILogout{
    @ApiProperty({example:"true"})
    success : boolean
    @ApiProperty({example:"Logout successful"})
    message : string
}