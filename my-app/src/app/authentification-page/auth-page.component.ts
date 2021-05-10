import {Component, OnInit} from '@angular/core';
import {UserService} from '../services/user-service';
import {RegisterAccount} from '../models/register-account';
import {catchError, take} from 'rxjs/operators';
import {of, throwError} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoginAccount} from '../models/login-account';
import {LoginResponse} from '../models/login-response';
import {HttpResponse} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss']
})
export class AuthPageComponent implements OnInit {
  selectedTab = 0;
  loginUsername = '';
  loginPassword = '';
  signUpUsername = '';
  signUpEmail = '';
  signUpPassword = '';
  signUpPassConfirm = '';
  userRegistered = false;

  constructor(private userService: UserService, private router: Router,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  login(): void {
    if (!this.loginValidate()) {
      return;
    }
    const loginAccount: LoginAccount = {
      password: this.loginPassword,
      username: this.loginUsername
    };
    this.userService.loginUser(loginAccount).pipe(
      take(1),
      catchError((error) => {
        console.log(error);
        if (error.status === 400) {
          this.openSnackBar('This account was not activated', 'Dismiss');
        } else {
          this.openSnackBar('Incorrect username or password', 'Dismiss');
        }
        return throwError('dnd');
      }),

    ).subscribe((loginResponse) => {
      localStorage.setItem('jwtToken', loginResponse.response.token);
      localStorage.setItem('role', loginResponse.response.role);
      this.router.navigate(['..', 'app'], {relativeTo: this.route});
    });
  }

  signUp(): void {
    if (!this.signUpValidate()) {
      return;
    }
    const registerAccount: RegisterAccount = {
      email: this.signUpEmail,
      password: this.signUpPassword,
      username: this.signUpUsername
    };
    console.log(registerAccount);
    this.userService.registerUser(registerAccount).pipe(
      take(1),
      catchError((err) => {
        console.log(err);
        this.openSnackBar('Username or email already exists', 'Dismiss');
        return of();
      })
    ).subscribe(() => {
      this.userRegistered = true;
    });
  }

  signUpValidate(): boolean {
    if (!this.signUpUsername || !this.signUpPassword || !this.signUpEmail || !this.signUpPassConfirm) {
      this.openSnackBar('Please complete all fields', 'Dismiss');
      return false;
    }
    if (this.signUpPassword !== this.signUpPassConfirm) {
      this.openSnackBar('Confirmed password is not the same', 'Dismiss');
      return false;
    }
    if (this.signUpPassword.length < 5) {
      this.openSnackBar('Password must have at least 6 characters', 'Dismiss');
      return false;
    }
    if (!this.validateEmail(this.signUpEmail)) {
      this.openSnackBar('Please enter a correct email', 'Dismiss');
      return false;
    }
    return true;
  }

  loginValidate(): boolean {
    if (!this.loginUsername || !this.loginPassword) {
      this.openSnackBar('Please complete all fields', 'Dismiss');
      return false;
    }
    return true;
  }

  validateEmail(email: string): boolean {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }


}
