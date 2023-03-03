import { FileType } from './../app.types';
import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';

import { FileTypeEnum } from 'src/consts';

@Injectable()
export class PrintService {
  async getData(type?: FileType) {
    if (type) {
      return await readFile(`./src/questions-data/data.${type}`, 'ascii');
    }

    let response = 'All file types \n';

    await Promise.all(
      Object.values(FileTypeEnum).map(async (fileType) => {
        const dataByFileType = await this.getData(fileType);

        response += `\n ${fileType.toUpperCase()} \n ${dataByFileType} \n`;

        return true;
      }),
    );

    return response;
  }
}
