import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  async getDapp() {
    return 'hello, app';
  }
}
