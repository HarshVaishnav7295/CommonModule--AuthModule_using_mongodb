import { Module } from '@nestjs/common';
import { EmailService } from 'src/services/email.service';

@Module({
    exports:[EmailService],
    providers:[EmailService]
})
export class EmailModule {
  
}
