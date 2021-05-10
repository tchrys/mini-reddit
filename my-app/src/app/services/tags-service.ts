import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResponseInterface} from '../models/response-interface';
import {BasicModel} from '../models/basic-model';
import {TagAppearance} from '../models/tag-appearance';


@Injectable({providedIn: 'root'})
export class TagsService {
  root = 'http://localhost:3000/api/tags/';

  constructor(private httpClient: HttpClient) {
  }

  getAllTags(): Observable<ResponseInterface<BasicModel[]>> {
    return this.httpClient.get<ResponseInterface<BasicModel[]>>(this.root);
  }

  getTagsByName(search: string): Observable<ResponseInterface<BasicModel[]>> {
    const params = new HttpParams().set('search', search);
    return this.httpClient.get<ResponseInterface<BasicModel[]>>(`${this.root}contains`, {params});
  }

  getTagByName(search: string): Observable<ResponseInterface<BasicModel>> {
    const params = new HttpParams().set('search', search);
    return this.httpClient.get<ResponseInterface<BasicModel>>(`${this.root}match`, {params});
  }

  getTagsByQuestionId(questionId: number): Observable<ResponseInterface<BasicModel[]>> {
    return this.httpClient.get<ResponseInterface<BasicModel[]>>(`${this.root}question/${questionId}`);
  }

  getTagsByAppearances(): Observable<ResponseInterface<TagAppearance[]>> {
    return this.httpClient.get<ResponseInterface<TagAppearance[]>>(`${this.root}appearances`);
  }

}
