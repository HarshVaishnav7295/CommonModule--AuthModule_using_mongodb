import { ApiProperty } from "@nestjs/swagger"

export class IUpdatePassword{
    @ApiProperty({example:"true"})
    success : boolean
    @ApiProperty({example:"Password Updated."})
    message : string
}