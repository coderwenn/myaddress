import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(name = 'world'): { message: string } {
    return { message: `hello ${name}` };
  }

  getHealth(): { ok: boolean; time: string } {
    return { ok: true, time: new Date().toISOString() };
  }
}
