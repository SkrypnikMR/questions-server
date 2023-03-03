import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { load as loadYmlFile, dump as dumpYmlFile } from 'js-yaml';
import { writeFile } from 'fs/promises';

import { Question, QuestionsServiceInterface } from '../app.types';

@Injectable()
export class YmlService implements QuestionsServiceInterface {
  async readYmlFile<T>(filePath: string): Promise<T> {
    const content = await readFile(filePath, 'utf-8');
    return loadYmlFile(content) as T;
  }

  async writeYmlFile(filePath: string, data: any): Promise<any> {
    const yamlData = dumpYmlFile(data);

    return writeFile(filePath, yamlData);
  }

  async getQuestions(): Promise<Question[]> {
    return (await this.readYmlFile('./src/questions-data/data.yml')) ?? [];
  }

  async createQuestion(newQuestion: Question): Promise<boolean> {
    const oldYmlQuestions = await this.getQuestions();
    const newQuestions = [...oldYmlQuestions, newQuestion];

    await this.writeYmlFile('./src/questions-data/data.yml', newQuestions);

    return Promise.resolve(true);
  }
}
