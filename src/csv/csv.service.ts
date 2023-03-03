import { Injectable } from '@nestjs/common';
import * as csv from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';
import { createReadStream } from 'fs';

import { Question, QuestionsServiceInterface } from '../app.types';

@Injectable()
export class CsvService implements QuestionsServiceInterface {
  async readCSVFile<T>(filePath: string): Promise<T[]> {
    const results: T[] = [];
    const stream = createReadStream(filePath)
      .pipe(csv())
      .on('data', (data: T) => results.push(data));
    await new Promise((resolve, reject) => {
      stream.on('end', resolve);
      stream.on('error', reject);
    });
    return results;
  }

  async appendCsvFile<T>(filePath: string, data: T[]): Promise<void> {
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'id', title: 'id' },
        { id: 'text', title: 'text' },
      ],
    });
    await csvWriter.writeRecords(data);
  }

  async getQuestions(): Promise<Question[]> {
    return await this.readCSVFile<Question>('./src/questions-data/data.csv');
  }

  async createQuestion(newQuestion: Question): Promise<boolean> {
    const oldQuestions = await this.getQuestions();
    const newQuestionms = [...oldQuestions, newQuestion];

    await this.appendCsvFile<Question>(
      './src/questions-data/data.csv',
      newQuestionms,
    );

    return true;
  }
}
