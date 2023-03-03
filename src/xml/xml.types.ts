import { Question } from 'src/app.types';

export interface XmlQuestionsType {
  questions: {
    question: {
      _attributes: Question[];
    };
  };
}
