import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  questioncheck: boolean;
  forgottenusername: string;
  forgottenemail: string;
  authToken: any;
  user: any;

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { 
    this.questioncheck = false;
  }

  authenticateUser(user) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/authenticate', user, { headers: headers });
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  storeUserData(token: any, user: any) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loggedIn() {
    return !(this.jwtHelper.isTokenExpired());
  }

  getUserType() {
    if (this.loggedIn()) {
      let korisnik: any = JSON.parse(localStorage.getItem('user'));
      return korisnik.type;
    }
    else return "guest";
  }

  isAuthorized(allowedRoles: string[]): boolean {
    if (allowedRoles == null || allowedRoles.length === 0) {
      return true;
    }

    return allowedRoles.includes(this.getUserType());
  }

  checkForgottenUser(user) : Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/forgottenpassword', user, { headers: headers });
  }

  getUserSecretQuestion(user) : Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/getquestion', user, { headers: headers });
  }

  checkSecretAnswer(answer: string) : Observable<any> {
    const user = {
      username: this.forgottenusername,
      answer: answer
    };
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/questioncheck', user, { headers: headers });
  }

  changePassword(username, password): Observable<any>{
    const user = {
      username: username,
      newpass: password
    };
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/resetpassword', user, { headers: headers });

  }

  checkOldPassword(username, password): Observable<any>{
    const user = {
      username: username,
      oldpass: password
    };
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/checkpassword', user, { headers: headers });
  }

}
