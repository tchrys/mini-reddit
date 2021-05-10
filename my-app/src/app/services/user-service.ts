import {HttpClient, HttpParams} from '@angular/common/http';
import {RegisterAccount} from '../models/register-account';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {LoginAccount} from '../models/login-account';
import {LoginResponse} from '../models/login-response';
import {ResponseInterface} from '../models/response-interface';
import {UserRole} from '../models/user-role';
import {UserModel} from '../models/user-model';
import {ActivityModel} from '../models/activity-model';

@Injectable({providedIn: 'root'})
export class UserService {
  root = 'http://localhost:3000/api/users/';

  constructor(private httpClient: HttpClient) {
  }

  registerUser(registerAccount: RegisterAccount): Observable<any> {
    return this.httpClient.post(`${this.root}register`, registerAccount);
  }

  activateAccount(token: string): Observable<any> {
    return this.httpClient.get(`${this.root}activate/${token}`);
  }

  loginUser(loginAccount: LoginAccount): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${this.root}login`, loginAccount);
  }

  getMyRole(): Observable<ResponseInterface<UserRole>> {
    return this.httpClient.get<ResponseInterface<UserRole>>(`${this.root}my-role`);
  }

  getAllUsers(): Observable<ResponseInterface<UserModel[]>> {
    return this.httpClient.get<ResponseInterface<UserModel[]>>(this.root);
  }

  changeUserRole(userId: number, roleId: number): Observable<ResponseInterface<UserModel>> {
    return this.httpClient.put<ResponseInterface<UserModel>>(`${this.root}${userId}/role/${roleId}`, null);
  }

  deleteUser(userId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.root}${userId}`);
  }

  addSupport(registerAccount: RegisterAccount): Observable<ResponseInterface<UserModel>> {
    return this.httpClient.post<ResponseInterface<UserModel>>(`${this.root}support`, registerAccount);
  }

  getUserActivity(userId: number, days: number): Observable<ResponseInterface<ActivityModel[]>> {
    const params = new HttpParams().set('user', String(userId)).set('days', String(days));
    return this.httpClient.get<ResponseInterface<ActivityModel[]>>(`${this.root}activity/user`, {params});
  }

  getOverallActivity(type: string, days: number): Observable<ResponseInterface<ActivityModel[]>> {
    const params = new HttpParams().set('type', type).set('days', String(days));
    return this.httpClient.get<ResponseInterface<ActivityModel[]>>(`${this.root}activity/overall`, {params});
  }

}
