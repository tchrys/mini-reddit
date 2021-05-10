import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResponseInterface} from '../models/response-interface';
import {TopicModel} from '../models/topic-model';
import {TopicBody} from '../models/topic-body';
import {BasicModel} from '../models/basic-model';
import {ScoreModel} from '../models/score-model';

@Injectable({providedIn: 'root'})
export class TopicsService {
  root = 'http://localhost:3000/api/topics/';

  constructor(private httpClient: HttpClient) {
  }

  getAllTopics(): Observable<ResponseInterface<TopicModel>> {
    return this.httpClient.get<ResponseInterface<TopicModel>>(this.root);
  }

  addTopic(topicBody: TopicBody): Observable<ResponseInterface<TopicModel>> {
    return this.httpClient.post<ResponseInterface<TopicModel>>(this.root, topicBody);
  }

  getTopicById(id: number): Observable<ResponseInterface<TopicModel>> {
    return this.httpClient.get<ResponseInterface<TopicModel>>(`${this.root}${id}`);
  }

  updateTopic(basicModel: BasicModel): Observable<ResponseInterface<TopicModel>> {
    return this.httpClient.put<ResponseInterface<TopicModel>>(`${this.root}${basicModel.id}`, basicModel);
  }

  getTopicsByCategory(categoryId: number): Observable<ResponseInterface<TopicModel[]>> {
    return this.httpClient.get<ResponseInterface<TopicModel[]>>(`${this.root}category/${categoryId}`);
  }

  getPopularTopics(): Observable<ResponseInterface<ScoreModel[]>> {
    return this.httpClient.get<ResponseInterface<ScoreModel[]>>(`${this.root}popularity`);
  }

}
