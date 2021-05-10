import {Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TopicModel} from '../models/topic-model';
import {QuestionModel} from '../models/question-model';
import {FormControl} from '@angular/forms';
import {Observable, Subject} from 'rxjs';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {map, mergeMap, startWith, take, takeUntil} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {TopicsService} from '../services/topics-service';
import {QuestionService} from '../services/question-service';
import {VotesService} from '../services/votes-service';
import {AnswersService} from '../services/answers-service';
import {TagsService} from '../services/tags-service';
import {AppUpdatesService} from '../services/app-updates-service';
import {ResponseInterface} from '../models/response-interface';
import {BasicModel} from '../models/basic-model';
import {QuestionRequest} from '../models/question-request';

@Component({
  selector: 'app-tags-search',
  templateUrl: './tag-search.component.html',
  styleUrls: ['./tag-search.component.scss']
})
export class TagSearchComponent implements OnInit, OnDestroy {
  questionsRelated: QuestionModel[] = [];
  questionSelected!: QuestionModel;
  isQuestionSelected = false;
  now = new Date();
  tagsControl = new FormControl();
  searchTag = '';
  filteredOptions!: Observable<string[]>;
  private onDestroySubject: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private topicsService: TopicsService,
              private questionService: QuestionService,
              private votesService: VotesService,
              private answersService: AnswersService,
              private tagsService: TagsService,
              private appUpdatesService: AppUpdatesService,
              private ngZone: NgZone) {
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.onDestroySubject)).subscribe((params) => {
      this.isQuestionSelected = false;
    });
    this.filteredOptions = this.tagsControl.valueChanges
      .pipe(
        startWith(''),
        mergeMap((value: string) => this.tagsService.getTagsByName(value.toLowerCase())),
        map((tagsRes: ResponseInterface<BasicModel[]>) => tagsRes.response.map((bm) => bm.name))
      );
    this.appUpdatesService.commentsSentObs().pipe(takeUntil(this.onDestroySubject))
      .subscribe((val) => {
        if (val !== -1) {
          // tslint:disable-next-line:no-no-null-assertion
          this.questionSelected.answers = this.questionSelected.answers! + 1;
        }
      });
  }

  ngOnDestroy(): void {
    this.onDestroySubject.next();
    this.onDestroySubject.complete();
  }

  voteQuestion(question: QuestionModel): void {
    if (!question.voted) {
      this.votesService.voteQuestion(question.id).subscribe((q) => {
        question.voted = true;
        question.votes = q.response.votes;
      });
    } else {
      this.votesService.deleteQuestionVote(question.id).subscribe((q) => {
        question.voted = false;
        question.votes = q.response.votes;
      });
    }
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

  getComments(question: QuestionModel): void {
    this.questionSelected = question;
    this.isQuestionSelected = true;
    this.router.navigate([this.questionSelected.id], {relativeTo: this.route});
  }

  searchByTag(): void {
    this.searchTag = this.tagsControl.value;
    this.tagsControl.setValue('');
    this.tagsService.getTagByName(this.searchTag).pipe(
      mergeMap((value) => this.questionService.getQuestionsByTagId(value.response.id, 'date'))
    ).subscribe((ans) => {
      this.questionsRelated = ans.response;
      if (this.isQuestionSelected) {
        // this.router.navigate(['../'], {relativeTo: this.route});
      }
      this.isQuestionSelected = false;
    });
  }

  onToggleQuestionChange(toggleValue: string): void {
    this.tagsService.getTagByName(this.searchTag).pipe(
      mergeMap((value) => this.questionService.getQuestionsByTagId(value.response.id, toggleValue))
    ).subscribe((ans) => this.questionsRelated = ans.response);
  }

}
