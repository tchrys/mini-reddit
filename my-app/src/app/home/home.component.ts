import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {TrendsService} from '../services/trends-service';
import {ArticleModel} from '../models/article-model';
import {MatSelectChange} from '@angular/material/select';
import {TagsService} from '../services/tags-service';
import {TagAppearance} from '../models/tag-appearance';
import {ScoreModel} from '../models/score-model';
import {TopicsService} from '../services/topics-service';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {Label} from 'ng2-charts';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ImprovementService} from '../services/improvement-service';
import {ImprovementRequest} from '../models/improvement-request';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  hotArticles: ArticleModel[] = [];
  dailyArticles: ArticleModel[] = [];
  tagsAppearance: TagAppearance[] = [];
  categories: Map<string, string> = new Map<string, string>();
  popularTopics: ScoreModel[] = [];
  tagsInterest: ScoreModel[] = [];

  barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          precision: 0
        }
      }]
    }
  };
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  tagsAppLabels: Label[] = [];
  tagsAppData!: ChartDataSets[];
  tagsAppReady = false;
  tagsInterestLabels: Label[] = [];
  tagsInterestData!: ChartDataSets[];
  tagsInterestReady = false;
  topicsPopLabels: Label[] = [];
  topicsPopData!: ChartDataSets[];
  topicsReady = false;
  improvementType = '';
  comment = '';
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  triggerResize(): void {
    // Wait for changes to be applied, then trigger textarea resize.
    this.ngZone.onStable.pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  constructor(private trendsService: TrendsService,
              private topicsService: TopicsService,
              private tagsService: TagsService,
              private matSnackBar: MatSnackBar,
              private improvementService: ImprovementService,
              private ngZone: NgZone) {
    this.categories.set('All', 'all');
    this.categories.set('Entertainment', 'e');
    this.categories.set('Business', 'b');
    this.categories.set('Science', 't');
    this.categories.set('Health', 'm');
    this.categories.set('Sports', 's');
    this.categories.set('Top stories', 'h');
  }

  get categoryKeys(): string[] {
    return Array.from(this.categories.keys());
  }

  ngOnInit(): void {
    this.trendsService.getRealTime().subscribe((articles) => {
        this.hotArticles = articles.response;
    }
    );
    this.trendsService.getDaily().subscribe((articles) =>
      this.dailyArticles = articles.response
    );
    this.tagsService.getTagsByAppearances().subscribe((tags) => {
        this.tagsAppearance = tags.response.slice(0, Math.min(tags.response.length, 10));
        this.tagsAppLabels = this.tagsAppearance.map(value => value.name);
        this.tagsAppData = [
          { data: [...this.tagsAppearance.map(value => +value.appearances)], label: 'Most used tags' }
        ];
        this.tagsAppReady = true;
      }
    );
    this.trendsService.getInterest().subscribe((resp) => {
        this.tagsInterest = resp.response;
        this.tagsInterestLabels = this.tagsInterest.map(value => value.name);
        this.tagsInterestData = [
          { data: [...this.tagsInterest.map(value => +value.score)], label: 'Interest over the internet in these tags'}
        ];
        this.tagsInterestReady = true;
      }
    );
    this.topicsService.getPopularTopics().subscribe((topics) => {
        this.popularTopics = topics.response;
        this.topicsPopLabels = this.popularTopics.map(value => value.name);
        this.topicsPopData = [
          { data: [...this.popularTopics.map(value => +value.score)], label: 'Top 10 topics by questions no'}
        ];
        this.topicsReady = true;
      }
    );
  }

  formatArticleText(text: string): string {
    text = text.replace(/&quot;/g, '\"');
    text = text.replace(/&#39;/g, '\'');
    return text;
  }

  categorySelectChange($event: MatSelectChange): void {
    this.trendsService.getRealTime($event.value).subscribe((articles) =>
      this.hotArticles = articles.response
    );
  }

  addFeedback(): void {
    if (!this.comment || !this.improvementType) {
      this.openSnackBar('Please complete all fields', 'Dismiss');
    }
    const improvementRequest: ImprovementRequest = {improvementType: this.improvementType, request: this.comment};
    this.improvementService.addImprovement(improvementRequest).subscribe(() => {
      this.openSnackBar('Feedback has been sent', 'Dismiss');
      this.comment = '';
      this.improvementType = '';
    });
  }

  openSnackBar(message: string, action: string): void {
    this.matSnackBar.open(message, action, {
      duration: 2000
    });
  }
}
