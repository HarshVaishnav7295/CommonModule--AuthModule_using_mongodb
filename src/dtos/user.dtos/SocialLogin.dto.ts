import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class SocialLoginDto{
    @ApiProperty({example:"Harsh "})
    @IsString()
    name: string;
  
    @ApiProperty({example:"harshvaishnav@techtic.agency"})
    @IsEmail()
    email: string;
  
    @ApiProperty({example:"www.google.com"})
    @IsString()
    profilePic: string;

    @ApiProperty({example:"ded232dw"})
    @IsString()
    fb_id: string;
    
    @ApiProperty({example:"ded232dw "})
    @IsString()
    google_id: string;
    
    @ApiProperty({example:"ded232dw "})
    @IsString()
    apple_id: string;
}