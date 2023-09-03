import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApplicationHealth(): string {
    return 'The Aladdin E-Commerce is Running!';
  }
}
