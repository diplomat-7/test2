import { Get, Controller } from '@nestjs/common';

@Controller('api')
export class AppController {
  constructor() {}

  @Get()
  home() {
    return {
      message: 'Welcome to Framer API',
      data: {
        version: 1,
        author: 'Framer by SPLYD Team',
      },
    };
  }
}
