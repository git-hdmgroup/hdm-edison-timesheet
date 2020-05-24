import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../_services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import { LoginRequest } from '../../../_interfaces/login-request';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginSubscription: Subscription;

  form: FormGroup = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  isLoadingLogin = false;
  loginErrorVisible = false;

  constructor(private auth: AuthService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.loginSubscription?.unsubscribe();
  }

  login() {

    if (this.form.invalid) {
      return;
    }

    this.isLoadingLogin = true;

    const onLoginError = catchError(() => of(null));
    const input: LoginRequest = { ...this.form.value };

    this.loginSubscription = this.auth.login(input)
      .pipe(onLoginError)
      .subscribe((user) => {
        this.isLoadingLogin = false;

        if (!user) {
          this.loginErrorVisible = true;
          setTimeout(() => this.loginErrorVisible = false, 4000);
          return;
        }

        this.router.navigate(['/user-profile']);
      });
  }
}
