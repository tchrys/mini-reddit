import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserService} from '../services/user-service';
import {RegisterAccount} from '../models/register-account';
import {UserModel} from '../models/user-model';
import {MatTableDataSource} from '@angular/material/table';
import {BasicModel} from '../models/basic-model';
import {MatPaginator} from '@angular/material/paginator';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {Label} from 'ng2-charts';
import {ActivityModel} from '../models/activity-model';
import {MatDialog} from '@angular/material/dialog';
import {RoleDialogComponent} from '../role-dialog/role-dialog.component';

@Component({
  selector: 'app-user-admin',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.scss']
})
export class UserAdminComponent implements OnInit {
  supportUsername = '';
  supportEmail = '';
  supportPass = '';
  allUsers: UserModel[] = [];
  userSource: MatTableDataSource<UserModel> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['id', 'username', 'roleId', 'delete'];
  questionsActivity: ActivityModel[] = [];
  answersActivity: ActivityModel[] = [];
  userActivity: ActivityModel[] = [];


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
  barChartType: ChartType = 'line';
  barChartLegend = true;
  barChartPlugins = [];

  questionLikesLabels: Label[] = [];
  questionLikesData!: ChartDataSets[];
  questionLikesReady = false;

  answerLikesLabels: Label[] = [];
  answerLikesData!: ChartDataSets[];
  answerLikesReady = false;

  userLikesLabels: Label[] = [];
  userLikesData!: ChartDataSets[];
  userLikesReady = false;

  constructor(private snackBar: MatSnackBar,
              private userService: UserService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe((value) => {
      this.allUsers = value.response;
      this.userSource = new MatTableDataSource<UserModel>(this.allUsers);
      this.userSource.paginator = this.paginator;
    });

    this.userService.getOverallActivity('questions', 10).subscribe((value) => {
      this.questionsActivity = value.response;
      this.questionLikesLabels = this.questionsActivity.map(value1 => value1.date.split('T')[0]);
      this.questionLikesData = [
        {data: [...this.questionsActivity.map(value2 => value2.likes)], label: 'No of post likes'}
      ];
      this.questionLikesReady = true;
    });

    this.userService.getOverallActivity('answers', 10).subscribe((value) => {
      this.answersActivity = value.response;
      this.answerLikesLabels = this.answersActivity.map(value1 => value1.date.split('T')[0]);
      this.answerLikesData = [
        {data: [...this.answersActivity.map(value2 => value2.likes)], label: 'No of comments likes'}
      ];
      this.answerLikesReady = true;
    });

  }

  addSupportUser(): void {
    if (!this.supportEmail || !this.supportUsername || !this.supportPass) {
      this.openSnackBar('Please complete all fields', 'Dismiss');
      return;
    }
    if (this.supportPass.length < 6) {
      this.openSnackBar('Password is too short', 'Dismiss');
      return;
    }
    const registerAccount: RegisterAccount = {
      username: this.supportUsername,
      password: this.supportPass,
      email: this.supportEmail
    };
    this.userService.addSupport(registerAccount).subscribe((value) => {
      this.allUsers.push(value.response);
      this.userSource._updateChangeSubscription();
    });
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }

  deleteUser(element: UserModel): void {
    this.userService.deleteUser(element.id).subscribe(() => {
      const idx = this.allUsers.findIndex(value => value.id === element.id);
      this.allUsers.splice(idx, 1);
      this.userSource._updateChangeSubscription();
    });
  }

  changeUserRole(element: UserModel): void {
    const dialogRef = this.dialog.open(RoleDialogComponent, {
      width: '350px',
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      if (+result !== 0) {
        this.userService.changeUserRole(element.id, +result).subscribe((value) => {
          element.roleId = value.response.roleId;
        });
      }
    });
  }

  showUserStats(element: UserModel): void {
    this.userService.getUserActivity(element.id, 10).subscribe((value) => {
      this.userActivity = value.response;
      this.userLikesLabels = this.userActivity.map(value1 => value1.date.split('T')[0]);
      this.userLikesData = [
        {data: [...this.userActivity.map(value2 => value2.likes)], label: 'No of votes from ' + element.username}
      ];
      this.userLikesReady = true;
    });
  }
}
