import { Injectable } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';
import { ElementCompact, xml2js, Element } from 'xml-js';
import { create } from 'xmlbuilder2';

import { Question, QuestionsServiceInterface } from '../app.types';
import { XmlQuestionsType } from './xml.types';

@Injectable()
export class XmlService implements QuestionsServiceInterface {
  async writeXmlFile(filePath: string, data: any): Promise<void> {
    const root = create({ version: '1.0', encoding: 'UTF-8' }).ele('questions');
    for (const item of data) {
      root.ele('question', { id: item.id, text: item.text });
    }
    const xml = root.end({ prettyPrint: true });
    await writeFile(filePath, xml);
  }
  async readXmlFile(filePath: string): Promise<Element | ElementCompact> {
    const content = await readFile(filePath, 'utf8');
    const result = xml2js(content, { compact: true });
    return result;
  }
  async getQuestions(): Promise<Question[]> {
    const xmlQuestions = (await this.readXmlFile(
      './src/questions-data/data.xml',
    )) as unknown as XmlQuestionsType;

    if (!xmlQuestions?.questions) return [];

    const mappedQuestions = Object.values(xmlQuestions?.questions.question)
      .map((el, _index, array) => {
        const returnedEl = el as unknown as
          | { _attributes: Question }
          | Question;

        if (array.length === 1) return returnedEl as Question;

        return (returnedEl as { _attributes: Question })
          ._attributes as Question;
      })
      .flat();

    return mappedQuestions;
  }

  async createQuestion(newQuestion: Question): Promise<boolean> {
    const oldXmlQuestions = await this.getQuestions();
    const newQuestions = [...oldXmlQuestions, newQuestion];

    await this.writeXmlFile('./src/questions-data/data.xml', newQuestions);

    return true;
  }
}
