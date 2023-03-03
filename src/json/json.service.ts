import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

import { Question, QuestionsServiceInterface } from '../app.types';
import { JsonQuestionsType } from './json.types';

@Injectable()
export class JsonService implements QuestionsServiceInterface {
  private async readAndParseJSONFile<T>(filePath: string): Promise<T> {
    const fileData = await fs.promises.readFile(filePath, 'utf-8');
    return fileData.length ? JSON.parse(fileData) : {};
  }

  private async rewriteJSONFile(
    filePath: string,
    questions: JsonQuestionsType,
  ) {
    return await fs.promises.writeFile(filePath, JSON.stringify(questions));
  }

  async getQuestions(): Promise<Question[]> {
    const questionsFromFile =
      await this.readAndParseJSONFile<JsonQuestionsType>(
        './src/questions-data/data.json',
      );

    return Object.entries(questionsFromFile).map(([key, value]) => ({
      id: key,
      text: value.text,
    }));
  }

  async createQuestion(newQuestion: Question): Promise<boolean> {
    const questions = await this.getQuestions();
    const updatedQuestions = [
      ...questions,
      newQuestion,
    ].reduce<JsonQuestionsType>((acc, current) => {
      acc[current.id] = { text: current.text };

      return acc;
    }, {});

    this.rewriteJSONFile('./src/questions-data/data.json', updatedQuestions);

    return true;
  }
}
