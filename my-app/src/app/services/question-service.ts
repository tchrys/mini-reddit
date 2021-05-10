import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {QuestionRequest} from '../models/question-request';
import {ResponseInterface} from '../models/response-interface';
import {QuestionModel} from '../models/question-model';
import {Observable} from 'rxjs';
import {TextRequest} from '../models/text-request';


@Injectable({providedIn: 'root'})
export class QuestionService {
  root = 'http://localhost:3000/api/questions/';

  constructor(private httpClient: HttpClient) {
  }

  addQuestion(questionRequest: QuestionRequest): Observable<ResponseInterface<QuestionModel>> {
    return this.httpClient.post<ResponseInterface<QuestionModel>>(this.root, questionRequest);
  }

  getQuestionsLastDay(): Observable<ResponseInterface<QuestionModel[]>> {
    return this.httpClient.get<ResponseInterface<QuestionModel[]>>(`${this.root}last`);
  }

  getQuestionById(id: number): Observable<ResponseInterface<QuestionModel>> {
    return this.httpClient.get<ResponseInterface<QuestionModel>>(`${this.root}${id}`);
  }

  editQuestion(textRequest: TextRequest): Observable<ResponseInterface<QuestionModel>> {
    return this.httpClient.put<ResponseInterface<QuestionModel>>(`${this.root}${textRequest.id}`, textRequest);
  }

  getQuestionsByTopic(topicId: number, orderBy: string): Observable<ResponseInterface<QuestionModel[]>> {
    const params = new HttpParams().set('orderBy', orderBy);
    return this.httpClient.get<ResponseInterface<QuestionModel[]>>(`${this.root}topic/${topicId}`, {params});
  }

  getQuestionsByTagId(tagId: number, orderBy: string): Observable<ResponseInterface<QuestionModel[]>> {
    const params = new HttpParams().set('orderBy', orderBy);
    return this.httpClient.get<ResponseInterface<QuestionModel[]>>(`${this.root}tag/${tagId}`, {params});
  }

}
