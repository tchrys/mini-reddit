import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {ResponseInterface} from '../models/response-interface';
import {UserRole} from '../models/user-role';
import {UserService} from './user-service';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class RoleResolver implements Resolve<ResponseInterface<UserRole>> {
  constructor(private userService: UserService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<ResponseInterface<UserRole>> | Promise<ResponseInterface<UserRole>> | ResponseInterface<UserRole> {
    return this.userService.getMyRole();
  }
}
