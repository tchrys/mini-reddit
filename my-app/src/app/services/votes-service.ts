import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResponseInterface} from '../models/response-interface';
import {AnswerModel} from '../models/answer-model';
import {QuestionModel} from '../models/question-model';

@Injectable({providedIn: 'root'})
export class VotesService {
  root = 'http://localhost:3000/api/votes/';

  constructor(private httpClient: HttpClient) {
  }

  voteAnswer(answerId: number): Observable<ResponseInterface<AnswerModel>> {
    return this.httpClient.post<ResponseInterface<AnswerModel>>(`${this.root}answer/${answerId}`, null);
  }

  voteQuestion(questionId: number): Observable<ResponseInterface<QuestionModel>> {
    return this.httpClient.post<ResponseInterface<QuestionModel>>(`${this.root}question/${questionId}`, null);
  }

  deleteQuestionVote(questionId: number): Observable<ResponseInterface<QuestionModel>> {
    return this.httpClient.delete<ResponseInterface<QuestionModel>>(`${this.root}question/${questionId}`);
  }

  deleteAnswerVote(answerId: number): Observable<ResponseInterface<AnswerModel>> {
    return this.httpClient.delete<ResponseInterface<AnswerModel>>(`${this.root}answer/${answerId}`);
  }


}
