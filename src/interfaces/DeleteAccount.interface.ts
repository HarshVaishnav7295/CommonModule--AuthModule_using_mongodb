import { ApiProperty } from "@nestjs/swagger"

export class IDeleteAccount{
    @ApiProperty({example:"true"})
    success : boolean
    @ApiProperty({example:"User account deleted."})
    message : string
}