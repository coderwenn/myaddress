import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth(): { ok: boolean; time: string } {
    return this.appService.getHealth();
  }

  @Get('hello')
  getHello(@Query('name') name?: string): { message: string } {
    return this.appService.getHello(name);
  }
}
