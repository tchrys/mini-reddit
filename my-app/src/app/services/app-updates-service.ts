import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AppUpdatesService {
  commentToPost: BehaviorSubject<number> = new BehaviorSubject<number>(-1);

  sendComment(questionId: number): void {
    this.commentToPost.next(questionId);
  }

  commentsSentObs(): Observable<number> {
    return this.commentToPost.asObservable();
  }

}
