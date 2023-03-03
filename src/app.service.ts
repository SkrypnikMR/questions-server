import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { AppServices, Question, FileType, ValueOf } from './app.types';
import { CreateQuestionDto } from './dto/create-question.dto';
import { JsonService } from './json/json.service';
import { YmlService } from './yml/yml.service';
import { CsvService } from './csv/csv.service';
import { XmlService } from './xml/xml.service';

@Injectable()
export class AppService {
  private readonly services: AppServices;
  constructor(
    jsonService: JsonService,
    ymlService: YmlService,
    csvService: CsvService,
    xmlService: XmlService,
  ) {
    this.services = {
      json: jsonService,
      yml: ymlService,
      csv: csvService,
      xml: xmlService,
    };
  }

  private async getAllQuestions() {
    return Promise.all(
      Object.values(this.services).map(
        async (service: ValueOf<AppServices>) => {
          return await service.getQuestions();
        },
      ),
    );
  }

  async getQuestions(type?: FileType): Promise<Question[]> {
    const response: Question[] = [];

    if (type) {
      const questionByType = await this.services[type as 'json'].getQuestions();

      response.push(...questionByType);
    } else {
      const allQuestion = await this.getAllQuestions();
      response.push(...allQuestion.flat());
    }

    return response.filter(
      (question, index, arr) =>
        arr.findIndex((q) => q.id === question.id) === index,
    );
  }

  async createQuestion(createQuestionDto: CreateQuestionDto): Promise<boolean> {
    const newQuestion = { id: uuid(), text: createQuestionDto.text };
    const response = await Promise.all(
      createQuestionDto.types.map(async (type) => {
        return this.services[type as 'json'].createQuestion(newQuestion);
      }),
    );

    return response.every((res) => res === true);
  }
}
