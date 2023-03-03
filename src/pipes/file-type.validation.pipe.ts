import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { FileTypeEnum } from '../consts';

@Injectable()
export class FileTypeValidationPipe implements PipeTransform<string> {
  async transform(value: string): Promise<string> {
    const validTypes: string[] = Object.values(FileTypeEnum);

    if (value && !validTypes.includes(value)) {
      throw new BadRequestException(
        `Invalid type. Valid types are: ${validTypes.join(', ')}`,
      );
    }

    return value;
  }
}
