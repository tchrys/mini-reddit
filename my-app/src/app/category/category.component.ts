import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BasicModel} from '../models/basic-model';
import {TopicsService} from '../services/topics-service';
import {TopicModel} from '../models/topic-model';
import {CategoriesService} from '../services/categories-service';
import {mergeMap} from 'rxjs/operators';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  crtCategory!: BasicModel;
  topicsRelated: TopicModel[] = [];
  optionSelected = '';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private topicsService: TopicsService,
              private categoriesService: CategoriesService) { }

  ngOnInit(): void {
    this.route.data.subscribe(value => this.crtCategory = value.myCat.response);
    this.route.params.subscribe((params) => {
      const category = this.categoriesService.getCategoryById(+params.catId);
      const topics = this.topicsService.getTopicsByCategory(+params.catId);
      forkJoin([category, topics]).subscribe(result => {
        this.crtCategory = result[0].response;
        this.topicsRelated = result[1].response;
        this.menuOptionSelected(this.topicsRelated[0]);
      });
    });
  }

  getClass(menuOption: string): string {
    if (menuOption === this.optionSelected) {
      return 'selected';
    }
    return 'not-selected';
  }

  menuOptionSelected(option: TopicModel): void {
    this.optionSelected = option.name;
    this.router.navigate(['topic', option.id], {relativeTo: this.route});
  }

}
