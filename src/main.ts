import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Auth Module')
    .setDescription(`<h4>This is auth module ( common functionalities ) project.</h4><p>Contains features : <li>Register</li><li>Login</li><li>Send OTP</li><li>Verify OTP</li><li>User Profile Get-Update</li><li>Account Delete</li><li>Change Password</li><li>Forgot Password</li><li>Social Login</li><li>Logout</li></p>`)
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);

  await app.listen(process.env.BACKEND_PORT);
}
bootstrap();
