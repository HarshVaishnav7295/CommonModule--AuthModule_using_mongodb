import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { RegisterUserDto } from 'src/dtos/user.dtos/RegisterUser.dto';
import { AuthService } from 'src/services/auth.service';
import { Request, Response } from 'express';
import { UserService } from 'src/services/user.service';
import { LoginDto } from 'src/dtos/user.dtos/LoginUser.dto';
import { SocialLoginDto } from 'src/dtos/user.dtos/SocialLogin.dto';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/services/email.service';
import { OtpService } from 'src/services/otp.service';
import { RegisterOtpDto } from 'src/dtos/user.dtos/RegisterOtp.dto';
import { VerifyOtpDto } from 'src/dtos/user.dtos/VerifyOtp.dto';
import { ApiBadRequestResponse, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { IRegisterOtp } from 'src/interfaces/RegisterOtp.interface';
import { IVerifyOtp } from 'src/interfaces/VerifyOtp.interface';
import { IRegisterUser } from 'src/interfaces/RegisterUser.interface';
import { ILogin } from 'src/interfaces/LoginUser.interface';
import { IRefreshToken } from 'src/interfaces/RefreshToken.interface';
import { RefreshTokenDto } from 'src/dtos/user.dtos/RefreshToken.dto';
import { ISocialLogin } from 'src/interfaces/SocialLogin.interface';
import { ForgotPasswordOtpDto } from 'src/dtos/user.dtos/ForgotPasswordOtp.dto';
import { IForgotPasswordOtp } from 'src/interfaces/ForgotPasswordOtp.interface';
import { ForgetPasswordDto } from 'src/dtos/user.dtos/ForgetPassword.dto';
import { IForgetPassword } from 'src/interfaces/ForgetPassword.interface';

@Controller('/api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private otpService: OtpService,
  ) {}
  
  @Post('/register-otp')
  @ApiOkResponse({
    type:IRegisterOtp
  })
  async registerOtp(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: RegisterOtpDto ,
  ) {
    try {
      if (!body.email) {
        return res.status(400).json({
          success: false,
          error: 'Please provide email id.',
        });
      } else {
        const userExistsObj = await this.userService.UserExists(body.email)
        if(userExistsObj.success){
          return res.status(400).json({
            success:false,
            error:"Email already used."
          })
        }
        const otpObject = await this.otpService.generateOtp({
          email: body.email,
          length: 6,
          isDigitsAllowed: true,
          isLowerCaseAlphabetsAllowed: true,
          isUppercaseAlphabetsAllowed: true,
          isSpecialCharsAllowed: true,
        });
        if (otpObject.success) {
          let subject = 'Email verification.';
          let html = `
            <h3>Email verification</h3>
            <h4>Otp : ${otpObject.otp}</h4>
          `;
          const emailObject = await this.emailService.sendEmail({
            to: [body.email],
            isBcc: false,
            cc: [],
            subject: subject,
            html: html,
          });
          console.log('emailObje->', emailObject);
          if (emailObject.success) {
            return res.status(200).json({
              success: true,
              message: 'Otp sent on email : ' + body.email,
            });
          } else {
            return res.status(500).json({
              success: false,
              error: emailObject.error,
            });
          }
        } else {
          return res.status(500).json({
            success: false,
            error: otpObject.error,
          });
        }
      }
    } catch (error: any) {
      return res.status(500).json({
        success: 'false',
        error: error.message,
      });
    }
  }

  @Post('/otp-verify')
  @ApiOkResponse({
    type:IVerifyOtp
  })
  async registerOtpVerify(
    @Req() req: Request,
    @Body() body: VerifyOtpDto,
    @Res() res: Response,
  ) {
    try {
      if (!body.email || !body.otp) {
        return res.status(400).json({
          success: false,
          error: 'Please provide both email and otp',
        });
      } else {
        const otpVerifyObject = await this.otpService.verifyOtp(body);
        if (otpVerifyObject.success) {
          if (otpVerifyObject.isVerified) {
            return res.status(200).json({
              success: true,
              message: 'Otp verified.!!',
            });
          } else {
            return res.status(200).json({
              success: true,
              message: 'Invalid otp.!!',
            });
          }
        } else {
          return res.status(500).json({
            success: false,
            error: otpVerifyObject.error,
          });
        }
      }
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  @Post('/register')
  @ApiOkResponse({
    type:IRegisterUser
  })
  async registerUser(@Body() body: RegisterUserDto, @Res() res: Response) {
    try {
      if (!body.email || !body.name || !body.password) {
        return res.status(400).json({
          success: false,
          error: 'Please provide all fields email,name.password.',
        });
      } else {
        const userExists = await this.userService.UserExists(body.email);
        if (userExists.success) {
          return res.status(400).json({
            success: false,
            error: 'User with this email already exists.',
          });
        } else {
          const { user, success, error, statusCode,accessToken } =
            await this.authService.RegisterUser(body);
          return res.status(statusCode).json({
            success,
            error,
            user,
            accessToken
          });
        }
      }
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error.message,
        user: null,
      });
    }
  }

  @Post('/login')
  @ApiOkResponse({
    type:ILogin
  })
  async loginUser(@Body() body: LoginDto, @Res() res: Response) {
    try {
      if (!body.email || !body.password) {
        return res.status(400).json({
          success: false,
          error: 'Please provide both email and password.',
          user: null,
          accessToken: null,
        });
      } else {
        const { statusCode, success, error, user, accessToken } =
          await this.authService.LoginUser(body);
        return res.status(statusCode).json({
          success,
          error,
          accessToken,
          user,
        });
      }
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error.message,
        user: null,
        accessToken: null,
      });
    }
  }

  @Post('/refreshToken')
  @ApiOkResponse({
    type:IRefreshToken
  })
  async refreshToken(
    @Body() body: RefreshTokenDto,
    @Res() res: Response,
  ) {
    try {
      if (!body.accessToken) {
        return res.status(400).json({
          succcess: false,
          error: 'Please provide accessToken.',
        });
      } else {
        const { success, accessToken, error, statusCode } =
          await this.authService.RefreshToken(body.accessToken);

        return res.status(statusCode).json({
          success,
          accessToken,
          error,
        });
      }
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  @Post('/socialLogin')
  @ApiOkResponse({
    type:ISocialLogin
  })
  async socialLogin(@Body() body: SocialLoginDto, @Res() res: Response) {
    try {
      if (!body.email) {
        return res.status(400).json({
          succcess: false,
          error: 'Please provide all fields : email',
        });
      } else {
        const user = await this.userService.UserExists(body.email);
        if (user.success) {
          const updatedUser = await this.userService.UpdateUser(body);
          const payload = {
            id: updatedUser._id,
            email: updatedUser.email,
          };
          const accessToken = await this.jwtService.signAsync(payload);
          return res.status(200).json({
            success: true,
            error: '',
            accessToken: accessToken,
            user: updatedUser,
          });
        } else {
          const user = await this.authService.CreateSocialUser(body);
          const payload = {
            id: user._id,
            email: user.email,
          };
          const accessToken = await this.jwtService.signAsync(payload);
          return res.status(200).json({
            success: true,
            error: '',
            accessToken: accessToken,
            user,
          });
        }
      }
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  @Post('/forgot-password-otp')
  @ApiOkResponse({
    type:IForgotPasswordOtp
  })
  async getForgetPasswordOtp(@Req() req:Request,@Res() res:Response,@Body() body:ForgotPasswordOtpDto){
    try{
      if(!body.email){
        return res.status(400).json({
          success:false,
          error:"Please provide email id"
        })
      }else{
        const userExistsObj = await this.userService.UserExists(body.email)
        if(!userExistsObj.success){
          return res.status(400).json({
            success:false,
            error:"No user with this email"
          })
        }
        if(userExistsObj.user.fb_id || userExistsObj.user.google_id || userExistsObj.user.apple_id){
          return res.status(400).json({
            success:false,
            error:"Can't change password. This is social user"
          })
        }
        const otpObject = await this.otpService.generateOtp({
          email: body.email,
          length: 6,
          isDigitsAllowed: true,
          isLowerCaseAlphabetsAllowed: true,
          isUppercaseAlphabetsAllowed: true,
          isSpecialCharsAllowed: true,
        });
        if (otpObject.success) {
          let subject = 'Forgot Password.';
          let html = `
            <h3>Forgot Password</h3>
            <h4>Otp : ${otpObject.otp}</h4>
          `;
          const emailObject = await this.emailService.sendEmail({
            to: [body.email],
            isBcc: false,
            cc: [],
            subject: subject,
            html: html,
          });
          console.log('emailObje->', emailObject);
          if (emailObject.success) {
            return res.status(200).json({
              success: true,
              message: 'Otp sent on email : ' + body.email,
            });
          } else {
            return res.status(500).json({
              success: false,
              error: emailObject.error,
            });
          }
        }else {
          return res.status(500).json({
            success: false,
            error: otpObject.error,
          });
        }
      }
    }catch(error:any){
      return res.status(500).json({
        success:false,
        error : error.message
      })
    }
  }

  @Post('/forget-password')
  @ApiOkResponse({
    type:IForgetPassword
  })
  async forgetPassword(@Req() req:Request,@Res() res:Response,@Body() body:ForgetPasswordDto){
    try{
      if(!body.email || !body.otp || !body.password){
        return res.status(400).json({
          success:false,
          error:"Please provide all fields : email, otp, password"
        })
      }else{
        if (!body.email || !body.otp) {
          return res.status(400).json({
            success: false,
            error: 'Please provide both email and otp',
          });
        } else {
          const otpVerifyObject = await this.otpService.verifyOtp(body);
          if (otpVerifyObject.success) {
            if (otpVerifyObject.isVerified) {
              const passwordUpdated = await this.userService.UpdatePasswordByEmail(body)
                if(passwordUpdated.success){
                    return res.status(passwordUpdated.statusCode).json({
                        success:true,
                        message:"Password updated"
                    })
                }else{
                    return res.status(passwordUpdated.statusCode).json({
                        success:false,
                        error:passwordUpdated.error
                    })
                }
            } else {
              return res.status(200).json({
                success: true,
                message: 'Invalid otp.!!',
              });
            }
          } else {
            return res.status(500).json({
              success: false,
              error: otpVerifyObject.error,
            });
          }
        }
      }
    }catch(error:any){
      return res.status(500).json({
        success:false,
        error:error.message
      })
    }
  }

}
