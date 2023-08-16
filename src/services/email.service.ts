import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(data: {
    to: string[];
    isBcc: boolean;
    cc: string[];
    subject: string;
    html: string;
  }){
    try{
        console.log("called2")
        let info : any = null;
        const resp = await new Promise<{success:boolean,error?:string,message?:string}>((resolve,reject)=>{
            if(data.isBcc){
                this.mailerService.sendMail({
                    from : 'techtic.harshvaishnav@gmail.com',
                    bcc : data.to,
                    cc : data.cc,
                    subject : data.subject,
                    html : data.html
                })
                .then((info)=>{
                    console.log("Mail sent.",info)
                    resolve({
                        success:true,
                        error:""
                    })
                })
                .catch((err)=>{
                    console.log("Error while sending mail : ",err)
                    resolve({
                        success:false,
                        error:err
                    })
                })
            }else{
                this.mailerService.sendMail({
                    from : 'techtic.harshvaishnav@gmail.com',
                    to : data.to,
                    cc : data.cc,
                    subject : data.subject,
                    html : data.html
                })
                .then((info)=>{
                    console.log("Mail sent.",info)
                    resolve({
                        success:true,
                        message:"Email sent"
                    })
                })
                .catch((err)=>{
                    console.log("Error while sending mail : ",err)
                    resolve({
                        success:false,
                        error:err
                    })
                })
            }
        })
        return resp
    }catch(error:any){
        return {
            success:false,
            error:error.message
        }
    }
  }
}
