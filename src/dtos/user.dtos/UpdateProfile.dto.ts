import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateProfileDto{
    @ApiProperty({example:"Harsh"})
    @IsString()
    name : string

    @ApiProperty({example:"sqwsqwws"})
    @IsString()
    profilePic : string

    
}