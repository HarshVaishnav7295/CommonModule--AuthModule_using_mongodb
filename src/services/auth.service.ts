import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model, Document } from 'mongoose';
import { RegisterUserDto } from 'src/dtos/user.dtos/RegisterUser.dto';
import { GenerateHashedPassword,ComparePassword } from 'src/helpers/hashPassword.helper';
import { UserService } from './user.service';
import { LoginDto } from 'src/dtos/user.dtos/LoginUser.dto';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/dtos/user.dtos/User.dto';
import { UserProfileDto } from 'src/dtos/user.dtos/UserProfile.dto';
import { ObjectId } from 'mongodb';
import { SocialLoginDto } from 'src/dtos/user.dtos/SocialLogin.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<Document>,
    private userService: UserService,
    private jwtService : JwtService
  ) {}

  async RegisterUser(data: RegisterUserDto): Promise<{
    success:boolean,
    error:string,
    user:UserProfileDto,
    statusCode:number,
    accessToken:string
  }>{
    try {
      const hashedPassword = await GenerateHashedPassword(data.password);
      const user  = await this.userModel.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,
      })
      const payload = {
        id : user._id,
        //@ts-ignore
        email:user.email
    }
    const accessToken = await this.jwtService.signAsync(payload)
      const { success, profile, error, statusCode } =
        await this.userService.GetUserProfile(user._id);
      return {
        success: success,
        error,
        user: profile,
        statusCode: 201,
        accessToken
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        user: null,
        statusCode: 500,
        accessToken:""
      };
    }
  }

  async LoginUser(data: LoginDto):Promise<{
    success:boolean,
    error:string,
    statusCode:number,
    accessToken:string,
    user:UserProfileDto
  }>{
    const user = await this.userModel.findOne<UserDto>({
        email : data.email,
        isDeleted:false
    })
    if(!user){
      return {
        success:true,
        error:"No user found.!",
        statusCode:404,
        accessToken:"",
        user:null
      }
    }
    console.log("user->",user)
    if(user.loginType=='1'){
      return {
        success:true,
        error:"This is social user.",
        statusCode:400,
        accessToken:"",
        user:null
      }
    }
    const isPasswordTrue = await ComparePassword({candidatePassword:data.password,hashedPassword:user.password})
    if(isPasswordTrue){
        const payload = {
            id : user._id,
            email:user.email
        }
        const updatedUserData = await this.userModel.findByIdAndUpdate(new ObjectId(user._id),{
          isLogedIn : true
        })
        const accessToken = await this.jwtService.signAsync(payload)
        const profileData = await this.userService.GetUserProfile(user._id)
        return {
            success:true,
            error:"",
            statusCode:200,
            accessToken:accessToken,
            user:profileData.profile
        }
    }else{
        return {
            success:false,
            error:"Invalid Credentials.",
            statusCode:401,
            user:null,
            accessToken:""
        }
    }
  }

  async RefreshToken(token:string):Promise<{
    success:boolean,
    error:string,
    accessToken:string,
    statusCode:number
  }>{
    const decoded = this.jwtService.decode(token) as {
      id:string,
      email:string
      iat:number,
      exp:number
    }
    console.log('decoded', decoded)
    const user = await this.userModel.findOne<UserDto>({
      _id : new ObjectId(decoded.id),
      email : decoded.email,
      isDeleted:false
    })
    if(user){
      if(decoded.exp < Math.round(new Date().getTime() / 1000)){
        const newAccessToken = await this.jwtService.signAsync({
          id:decoded.id,
          email:decoded.email
        })
        return {success:true,error:"",accessToken:newAccessToken,statusCode:200}
      }else{
        return {success:false,error:"Token not expired",accessToken:token,statusCode:400}
      }
    }else{
      return {success:false,error:"Invalid Token",accessToken:token,statusCode:401}
    }
  }

  async CreateSocialUser(data: SocialLoginDto): Promise<UserProfileDto> {
    console.log('data', data);
    const user = await this.userModel.create({
      name: data.name,
      email: data.email,
      proflePic: data.profilePic,
      fb_id: data.fb_id ? data.fb_id : "",
      google_id:data.google_id ? data.google_id : "",
      apple_id:data.apple_id ? data.apple_id : "",
      loginType: 1,
      isLogedIn : true
    });
    console.log('user', user);
    const { profile } = await this.userService.GetUserProfile(user._id);
    return profile;
  }

  
}
