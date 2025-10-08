import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'NestJS Backend is running successfully on Vercel!';
  }
}
