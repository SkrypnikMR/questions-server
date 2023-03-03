import { Module } from '@nestjs/common';
import { PrintController } from './print.controller';
import { PrintService } from './print.service';

@Module({
  providers: [PrintService],
  exports: [],
  controllers: [PrintController],
})
export class PrintModule {}
