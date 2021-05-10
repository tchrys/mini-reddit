import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class AuthService {

  getToken(): string {
    return localStorage.getItem('jwtToken') as string;
  }
}
