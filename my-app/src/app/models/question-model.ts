import {BasicModel} from './basic-model';

export interface QuestionModel {
  id: number;
  text: string;
  votes: number;
  topicId: number;
  questionDate: string;
  tags: BasicModel[];
  voted?: boolean;
  answers?: number;
}
