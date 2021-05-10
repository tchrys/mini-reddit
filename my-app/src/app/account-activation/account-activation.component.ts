import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {catchError, take} from 'rxjs/operators';
import {UserService} from '../services/user-service';
import {of} from 'rxjs';

@Component({
  selector: 'app-account-activation',
  templateUrl: './account-activation.component.html',
  styleUrls: ['./account-activation.component.scss']
})
export class AccountActivationComponent implements OnInit {
  token = '';
  tokenUsed = false;

  constructor(private route: ActivatedRoute, private router: Router,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(take(1)).subscribe(params => {
        this.token = params.token;
        this.userService.activateAccount(this.token).pipe(
          take(1),
          catchError(() => {
            this.tokenUsed = true;
            return of();
          }))
          .subscribe(() => {
            this.router.navigate(['..', 'login'], {relativeTo: this.route});
          });
        console.log(this.token);
      }
    );
  }

}
