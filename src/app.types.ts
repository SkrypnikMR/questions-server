import { CsvService } from './csv/csv.service';
import { JsonService } from './json/json.service';
import { XmlService } from './xml/xml.service';
import { YmlService } from './yml/yml.service';

export interface AppServices {
  json: JsonService;
  yml: YmlService;
  csv: CsvService;
  xml: XmlService;
}

export class Question {
  id: string;
  text: string;
}

export type FileType = 'json' | 'csv' | 'xml' | 'yml';

export declare type ValueOf<T> = T[keyof T];

export interface QuestionsServiceInterface {
  getQuestions: () => Promise<Question[]>;
  createQuestion: (question: Question) => Promise<boolean>;
}
