import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AnswerRequest} from '../models/answer-request';
import {Observable} from 'rxjs';
import {ResponseInterface} from '../models/response-interface';
import {AnswerModel} from '../models/answer-model';
import {TextRequest} from '../models/text-request';


@Injectable({providedIn: 'root'})
export class AnswersService {
  root = 'http://localhost:3000/api/answers/';

  constructor(private httpClient: HttpClient) {
  }

  addAnswer(answerRequest: AnswerRequest): Observable<ResponseInterface<AnswerModel>> {
    return this.httpClient.post<ResponseInterface<AnswerModel>>(this.root, answerRequest);
  }

  getAnswerById(id: number): Observable<ResponseInterface<AnswerModel>> {
    return this.httpClient.get<ResponseInterface<AnswerModel>>(`${this.root}${id}`);
  }

  updateAnswer(textRequest: TextRequest): Observable<ResponseInterface<AnswerModel>> {
    return this.httpClient.put<ResponseInterface<AnswerModel>>(`${this.root}${textRequest.id}`, textRequest);
  }

  getAnswerByQuestion(questionId: number, orderBy: string): Observable<ResponseInterface<AnswerModel[]>> {
    const params = new HttpParams().set('orderBy', orderBy);
    return this.httpClient.get<ResponseInterface<AnswerModel[]>>(`${this.root}question/${questionId}`, {params});
  }

}
