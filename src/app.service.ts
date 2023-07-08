import { Injectable } from '@nestjs/common';
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello welcome to Nine Dev 123 456';
  }
}
