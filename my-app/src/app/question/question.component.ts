import {Component, OnDestroy, OnInit} from '@angular/core';
import {AnswerRequest} from '../models/answer-request';
import {AnswerModel} from '../models/answer-model';
import {QuestionModel} from '../models/question-model';
import {AnswersService} from '../services/answers-service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {VotesService} from '../services/votes-service';
import {QuestionService} from '../services/question-service';
import {AppUpdatesService} from '../services/app-updates-service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit, OnDestroy {
  comment = '';
  answersForQ: AnswerModel[] = [];
  questionId = -1;
  questionSelected!: QuestionModel;
  now = new Date();
  private onDestroySubject: Subject<void> = new Subject<void>();

  constructor(private answersService: AnswersService,
              private votesService: VotesService,
              private questionService: QuestionService,
              private appUpdatesService: AppUpdatesService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.onDestroySubject)).subscribe((params) => {
      this.questionId = +params.questionId;
      this.questionService.getQuestionById(this.questionId).subscribe((value) =>
        this.questionSelected = value.response
      );
      this.answersService.getAnswerByQuestion(this.questionId, 'date').subscribe(
        (value) => {
          this.answersForQ = value.response;
          console.log(this.answersForQ);
        }
      );
    });
  }

  ngOnDestroy(): void {
    this.onDestroySubject.next();
    this.onDestroySubject.complete();
  }

  getTimeDistance(postDate: string): string {
    const questionDate = new Date(postDate);
    // this.now = new Date();
    const secondsBetween = (this.now.getTime() - questionDate.getTime()) / 1000;
    if (secondsBetween < 60) {
      return this.getTimeText(this.now.getSeconds() - questionDate.getSeconds(), 'second');
    } else if (secondsBetween < 3600) {
      return this.getTimeText(this.now.getMinutes() - questionDate.getMinutes(), 'minute');
    } else if (secondsBetween < 3600 * 24) {
      return this.getTimeText(this.now.getHours() - questionDate.getHours(), 'hour');
    } else if (secondsBetween < 3600 * 24 * 30) {
      return this.getTimeText(Math.floor(secondsBetween / (3600 * 24)), 'day');
    } else if (secondsBetween < 3600 * 24 * 365) {
      return this.getTimeText(Math.floor(secondsBetween / (3600 * 24 * 30)), 'month');
    } else {
      return this.getTimeText(this.now.getFullYear() - questionDate.getFullYear(), 'year');
    }
  }

  getTimeText(diff: number, timeUnit: string): string {
    if (diff <= 0) {
      if (timeUnit === 'second' || timeUnit === 'minute') {
        diff += 60;
      } else if (timeUnit === 'hour') {
        diff += 24;
      }
    }
    if (diff === 1) {
      return '1 ' + timeUnit + ' ago';
    }
    return '' + diff + ' ' + timeUnit + 's ago';
  }

  sendAnswer(): void {
    if (!this.comment) {
      return;
    }
    const answerRequest: AnswerRequest = {questionId: this.questionSelected.id, text: this.comment};
    this.answersService.addAnswer(answerRequest).subscribe((value) => {
      this.answersForQ.push(value.response);
      this.comment = '';
      this.appUpdatesService.sendComment(this.questionSelected.id);
    });
  }

  onToggleAnswers(toggleValue: string): void {
    this.answersService.getAnswerByQuestion(this.questionSelected.id, toggleValue).subscribe(
      (value) => {
        this.answersForQ = value.response;
      }
    );
  }

  voteAnswer(answer: AnswerModel): void {
    if (!answer.voted) {
      this.votesService.voteAnswer(answer.id).subscribe((a) => {
        answer.voted = true;
        answer.votes = a.response.votes;
      });
    } else {
      this.votesService.deleteAnswerVote(answer.id).subscribe((a) => {
        answer.voted = false;
        answer.votes = a.response.votes;
      });
    }
  }

  questionTagsToString(question: QuestionModel): string {
    return question.tags.map(value => value.name).join(',');
  }

}
