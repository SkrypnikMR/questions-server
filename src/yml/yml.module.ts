import { Module } from '@nestjs/common';
import { YmlService } from './yml.service';

@Module({
  providers: [YmlService],
  exports: [YmlService],
})
export class YmlModule {}
