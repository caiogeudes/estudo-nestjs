import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, UserController],
  providers: [AppService],
})

export class AppModule { }
