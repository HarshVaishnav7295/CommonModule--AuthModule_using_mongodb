import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { ConfigModule,ConfigService } from '@nestjs/config';
import {MailerModule} from '@nestjs-modules/mailer'
import { EmailService } from './services/email.service';
import { OtpService } from './services/otp.service';
import { EmailModule } from './modules/email/email.module';
import { OtpModule } from './modules/otp/otp.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath : `.env`
    }),
    AuthModule,UserModule,
     MongooseModule.forRootAsync({
      inject:[ConfigService],
      useFactory : (config:ConfigService)=>({
        uri:config.get<string>('DB_URL'),
      })
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port : 587,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      },
    }),
    UserModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
