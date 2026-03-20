import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { dbConfig } from './database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
