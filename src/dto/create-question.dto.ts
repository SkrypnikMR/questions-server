import { IsNotEmpty, IsEnum, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { FileTypeEnum } from 'src/consts';

export class CreateQuestionDto {
  @IsNotEmpty()
  @ArrayMinSize(1)
  @IsEnum(FileTypeEnum, { each: true })
  @ApiProperty()
  types: FileTypeEnum[];

  @IsNotEmpty()
  @ApiProperty()
  text: string;
}
