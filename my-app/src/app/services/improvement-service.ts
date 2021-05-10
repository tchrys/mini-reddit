import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ImprovementRequest} from '../models/improvement-request';
import {Observable} from 'rxjs';
import {ResponseInterface} from '../models/response-interface';
import {ImprovementModel} from '../models/improvement-model';


@Injectable({providedIn: 'root'})
export class ImprovementService {
  root = 'http://localhost:3000/api/improvements/';

  constructor(private httpClient: HttpClient) {
  }

  addImprovement(improvementRequest: ImprovementRequest): Observable<ResponseInterface<ImprovementModel>> {
    return this.httpClient.post<ResponseInterface<ImprovementModel>>(this.root, improvementRequest);
  }

  getAllImprovements(): Observable<ResponseInterface<ImprovementModel[]>> {
    return this.httpClient.get<ResponseInterface<ImprovementModel[]>>(this.root);
  }

  deleteImprovement(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.root}${id}`);
  }

}
