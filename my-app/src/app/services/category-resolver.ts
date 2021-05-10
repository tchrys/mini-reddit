import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {ResponseInterface} from '../models/response-interface';
import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';
import {CategoriesService} from './categories-service';
import {BasicModel} from '../models/basic-model';

@Injectable({providedIn: 'root'})
export class CategoryResolver implements Resolve<ResponseInterface<BasicModel>> {
  constructor(private categoriesService: CategoriesService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<ResponseInterface<BasicModel>> | Promise<ResponseInterface<BasicModel>> | ResponseInterface<BasicModel> {
    let catId: number;
    catId = +(route.paramMap.get('catId') as string);
    return this.categoriesService.getCategoryById(catId);
  }
}
