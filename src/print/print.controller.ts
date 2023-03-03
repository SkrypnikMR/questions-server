import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { FileType } from 'src/app.types';
import { FileTypeValidationPipe } from 'src/pipes/file-type.validation.pipe';
import { PrintService } from './print.service';

@Controller('data')
export class PrintController {
  constructor(private readonly printService: PrintService) {}

  @Get()
  @ApiQuery({
    name: 'type',
    description: 'The file type of questions',
    required: false,
  })
  @UsePipes(new FileTypeValidationPipe())
  async getData(@Query('type') type?: FileType): Promise<any> {
    return this.printService.getData(type);
  }
}
