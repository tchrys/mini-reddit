import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResponseInterface} from '../models/response-interface';
import {ArticleModel} from '../models/article-model';
import {ScoreModel} from '../models/score-model';

@Injectable({providedIn: 'root'})
export class TrendsService {
  root = 'http://localhost:3000/api/trends/';

  constructor(private httpClient: HttpClient) {
  }

  getDaily(): Observable<ResponseInterface<ArticleModel[]>> {
    return this.httpClient.get<ResponseInterface<ArticleModel[]>>(`${this.root}daily`);
  }

  getRealTime(key?: string): Observable<ResponseInterface<ArticleModel[]>> {
    if (!key) {
      key = 'all';
    }
    return this.httpClient.get<ResponseInterface<ArticleModel[]>>(`${this.root}real-time/${key}`);
  }

  getInterest(): Observable<ResponseInterface<ScoreModel[]>> {
    return this.httpClient.get<ResponseInterface<ScoreModel[]>>(`${this.root}interest`);
  }

}
