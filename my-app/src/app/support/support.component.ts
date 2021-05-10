import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CategoriesService} from '../services/categories-service';
import {TopicsService} from '../services/topics-service';
import {BasicModel} from '../models/basic-model';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {TopicModel} from '../models/topic-model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NameRequest} from '../models/name-request';
import {TopicBody} from '../models/topic-body';
import {ImprovementModel} from '../models/improvement-model';
import {ImprovementService} from '../services/improvement-service';
import {MatSelectChange} from '@angular/material/select';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit, AfterViewInit {
  categoryName = '';
  topicName = '';
  categorySelectedForTopic = 0;
  categoryTableClicked = -1;
  improvements: ImprovementModel[] = [];
  categories: BasicModel[] = [];
  topics: TopicModel[] = [];
  catSource: MatTableDataSource<BasicModel> = new MatTableDataSource();
  topicSource: MatTableDataSource<TopicModel> = new MatTableDataSource<TopicModel>();
  topicsInfo = 'No category selected yet';
  displayedColumns: string[] = ['name'];
  @ViewChild('categoryPaginator') catPaginator!: MatPaginator;
  @ViewChild('topicPaginator') topicPaginator!: MatPaginator;

  constructor(private categoriesService: CategoriesService,
              private topicsService: TopicsService,
              private improvementService: ImprovementService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.categoriesService.getAllCategories().subscribe((value) => {
      this.categories = value.response;
      this.catSource = new MatTableDataSource<BasicModel>(this.categories);
      this.catSource.paginator = this.catPaginator;
    });
    this.improvementService.getAllImprovements().subscribe((value) => {
      this.improvements = value.response;
    });
  }

  ngAfterViewInit(): void {
    this.catSource.paginator = this.catPaginator;
    this.topicSource.paginator = this.topicPaginator;
  }

  categorySelected(element: BasicModel): void {
    console.log(element);
    this.topicsService.getTopicsByCategory(element.id).subscribe((value) => {
      this.topics = value.response;
      if (this.topics.length === 0) {
        this.topicsInfo = `No topics for ${element.name}`;
      } else {
        this.topicsInfo = `${element.name}'s topics`;
      }
      this.categoryTableClicked = element.id;
      this.topicSource = new MatTableDataSource<TopicModel>(this.topics);
      this.topicSource.paginator = this.topicPaginator;
    });
  }

  addCategory(): void {
    if (!this.categoryName) {
      this.openSnackBar('Please complete all fields', 'Dismiss');
      return;
    }
    const nameRequest: NameRequest = {name: this.categoryName};
    this.categoriesService.addCategory(nameRequest).subscribe((value) => {
      this.categories.push(value.response);
      this.catSource._updateChangeSubscription();
    });
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }

  addTopic(): void {
    if (!this.topicName || this.categorySelectedForTopic === 0) {
      this.openSnackBar('Please complete all fields', 'Dismiss');
      return;
    }
    const topicBody: TopicBody = {categoryId: this.categorySelectedForTopic, name: this.topicName};
    this.topicsService.addTopic(topicBody).subscribe((value) => {
      if (this.categoryTableClicked !== -1) {
        this.topics.push(value.response);
        this.topicSource._updateChangeSubscription();
      }
    });
  }

  deleteImprovement(improvement: ImprovementModel): void {
    this.improvementService.deleteImprovement(improvement.id).subscribe(() => {
      this.improvements = this.improvements.filter(value => value.id !== improvement.id);
    });
  }

  categorySelectChange($event: MatSelectChange): void {
    this.categorySelectedForTopic = $event.value;
  }
}
