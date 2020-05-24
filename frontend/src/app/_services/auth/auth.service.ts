import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginRequest } from '../../_interfaces/login-request';
import { tap, map } from 'rxjs/operators';
import { LoginResponse } from '../../_interfaces/login-response';
import { AppUser } from '../../_interfaces/entities/app-user';

const URL_LOGIN = `${environment.jwtUrl}/login`;
const LS_USER = 'hdm-ts:user';
const LS_AUTH = 'hdm-ts:auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  setUserToLocalStorage(user: AppUser): void {
    localStorage.setItem(LS_USER, JSON.stringify(user));
  }

  setTokenToLocalStorage(token: string): void {
    localStorage.setItem(LS_AUTH, token);
  }

  getCurrentUser(): AppUser {
    return JSON.parse(localStorage.getItem(LS_USER));
  }

  getToken() {
    return localStorage.getItem(LS_AUTH);
  }

  clearLocalStorage() {
    localStorage.removeItem(LS_USER);
    localStorage.removeItem(LS_AUTH);
  }

  logout() {
    this.clearLocalStorage();
  }

  login(value: LoginRequest) {
    return this.http
      .post<LoginResponse>(URL_LOGIN, value)
      .pipe(tap((data) => {
        this.setTokenToLocalStorage(data.token);
        this.setUserToLocalStorage(data.user);
      }))
      .pipe(map(data => data));
  }
}
