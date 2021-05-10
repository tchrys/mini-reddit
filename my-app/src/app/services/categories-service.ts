import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NameRequest} from '../models/name-request';
import {Observable} from 'rxjs';
import {ResponseInterface} from '../models/response-interface';
import {BasicModel} from '../models/basic-model';


@Injectable({providedIn: 'root'})
export class CategoriesService {
  root = 'http://localhost:3000/api/categories/';

  constructor(private httpClient: HttpClient) {
  }

  addCategory(nameRequest: NameRequest): Observable<ResponseInterface<BasicModel>> {
    return this.httpClient.post<ResponseInterface<BasicModel>>(this.root, nameRequest);
  }

  getAllCategories(): Observable<ResponseInterface<BasicModel[]>> {
    return this.httpClient.get<ResponseInterface<BasicModel[]>>(this.root);
  }

  getCategoryById(id: number): Observable<ResponseInterface<BasicModel>> {
    return this.httpClient.get<ResponseInterface<BasicModel>>(`${this.root}${id}`);
  }

  updateCategory(basicModel: BasicModel): Observable<ResponseInterface<BasicModel>> {
    return this.httpClient.put<ResponseInterface<BasicModel>>(`${this.root}${basicModel.id}`, basicModel);
  }

  deleteCategory(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.root}${id}`);
  }

}
