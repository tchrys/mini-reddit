import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable({providedIn: 'root'})
export class RolesService {
  root = 'http://localhost:3000/api/roles/';

  constructor(private httpClient: HttpClient) {
  }

}
