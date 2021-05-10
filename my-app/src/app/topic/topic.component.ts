import {Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TopicModel} from '../models/topic-model';
import {QuestionService} from '../services/question-service';
import {QuestionModel} from '../models/question-model';
import {VotesService} from '../services/votes-service';
import {AnswersService} from '../services/answers-service';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {map, mergeMap, startWith, take, takeUntil} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {Observable, Subject} from 'rxjs';
import {TagsService} from '../services/tags-service';
import {ResponseInterface} from '../models/response-interface';
import {BasicModel} from '../models/basic-model';
import {QuestionRequest} from '../models/question-request';
import {TopicsService} from '../services/topics-service';
import {AppUpdatesService} from '../services/app-updates-service';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent implements OnInit, OnDestroy {
  myTopic!: TopicModel;
  questionsRelated: QuestionModel[] = [];
  questionSelected!: QuestionModel;
  isQuestionSelected = false;
  postText = '';
  now = new Date();
  tagsControl = new FormControl();
  tagsAdded: string[] = [];
  filteredOptions!: Observable<string[]>;
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  private onDestroySubject: Subject<void> = new Subject<void>();

  triggerResize(): void {
    // Wait for changes to be applied, then trigger textarea resize.
    this.ngZone.onStable.pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

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
      this.tagsAdded = [];
      this.postText = '';
      this.isQuestionSelected = false;
      this.topicsService.getTopicById(+params.topicId).subscribe((topic) => {
        this.myTopic = topic.response;
      });
      this.questionService.getQuestionsByTopic(+params.topicId, 'date').subscribe(
        (value) => {
          this.questionsRelated = value.response;
          console.log(this.questionsRelated);
        }
      );
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
    console.log(this.questionSelected);
    this.router.navigate(['question', this.questionSelected.id], {relativeTo: this.route});
  }

  sendQuestion(): void {
    if (!this.postText) {
      return;
    }
    const questionRequest: QuestionRequest = {
      topicId: this.myTopic.id,
      text: this.postText,
      questionTags: this.tagsAdded
    };
    this.questionService.addQuestion(questionRequest).subscribe((value) => {
      this.questionsRelated.push(value.response);
    });
    this.tagsControl.setValue('');
    this.postText = '';
    this.tagsAdded = [];
  }

  addTag(): void {
    this.tagsAdded.push(this.tagsControl.value);
    this.tagsControl.setValue('');

  }

  onChipRemoved(tag: string): void {
    this.tagsAdded = this.tagsAdded.filter(value => value !== tag);
  }

  onToggleQuestionChange(toggleValue: string): void {
    this.questionService.getQuestionsByTopic(this.myTopic.id, toggleValue).subscribe(
      (value) => {
        this.questionsRelated = value.response;
      }
    );
  }
}
