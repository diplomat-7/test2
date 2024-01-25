import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { CommonsService } from './commons.service';

@Module({
  providers: [CommonsService],
  exports: [CommonsService],
  imports: [HttpModule],
})
export class CommonsModule {}
