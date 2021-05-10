export interface AnswerModel {
  id: number;
  text: string;
  questionId: number;
  votes: number;
  answerDate: string;
  voted?: boolean;
}
