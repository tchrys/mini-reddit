import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {ResponseInterface} from '../models/response-interface';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {BasicModel} from '../models/basic-model';
import {TopicsService} from './topics-service';

@Injectable({providedIn: 'root'})
export class TopicResolver implements Resolve<ResponseInterface<BasicModel>> {
  constructor(private topicsService: TopicsService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<ResponseInterface<BasicModel>> | Promise<ResponseInterface<BasicModel>> | ResponseInterface<BasicModel> {
    let topicId: number;
    topicId = +(route.paramMap.get('topicId') as string);
    return this.topicsService.getTopicById(topicId);
  }
}
