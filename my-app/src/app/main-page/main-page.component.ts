import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RolesEnum} from '../models/roles-enum';
import {CategoriesService} from '../services/categories-service';
import {BasicModel} from '../models/basic-model';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  optionSelected = 'home';
  categories: BasicModel[] = [];
  myRole = '';

  constructor(private route: ActivatedRoute,
              private router: Router, private categoriesService: CategoriesService) {
  }

  ngOnInit(): void {
    console.log(localStorage.getItem('jwtToken'));
    console.log(localStorage.getItem('role'));
    this.route.data.subscribe((value) => this.myRole = value.myRole.response.role);
    this.categoriesService.getAllCategories().subscribe(value => this.categories = value.response);
  }

  getClass(menuOption: string): string {
    if (menuOption === this.optionSelected) {
      return 'selected';
    }
    return 'not-selected';
  }

  menuOptionSelected(option: BasicModel): void {
    this.optionSelected = option.name;
    this.router.navigate(['category', option.id], {relativeTo: this.route});
  }

  homeSelected(): void {
    this.optionSelected = 'home';
    this.router.navigate(['home'], {relativeTo: this.route});
  }

  supportSelected(): void {
    this.optionSelected = 'support';
    this.router.navigate(['support'], {relativeTo: this.route});
  }

  searchSelected(): void {
    this.optionSelected = 'search';
    this.router.navigate(['search'], {relativeTo: this.route});
  }


  usersSelected(): void {
    this.optionSelected = 'users';
    this.router.navigate(['users'], {relativeTo: this.route});
  }

  signout(): void {
    localStorage.clear();
    this.router.navigate(['..', 'login'], {relativeTo: this.route});
  }
}
