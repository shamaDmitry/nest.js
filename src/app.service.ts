import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): { message: string; mode?: string } {
    return {
      message: 'Hello World!',
      mode: process.env.NODE_ENV,
    };
  }
}
