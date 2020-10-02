import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  authToken: any;

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }

  getSubjects(conditions): Observable<any> {
    this.authToken = localStorage.getItem('id_token');
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', this.authToken);
    headers = headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/subjects/getsubjects', conditions, { headers: headers });
  }

  getEmployees(): Observable<any> {
    this.authToken = localStorage.getItem('id_token');
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', this.authToken);
    headers = headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:3000/users/getemployees', { headers: headers });
  }

  addSubject(subject): Observable<any>{
    this.authToken = localStorage.getItem('id_token');
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', this.authToken);
    headers = headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/subjects/addnewsubject', subject, { headers: headers });
  }

  modifySubject(old_subject,new_subject): Observable<any>{
    this.authToken = localStorage.getItem('id_token');
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', this.authToken);
    headers = headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/subjects/updatesubjects', {keys: old_subject, params: new_subject}, { headers: headers });
  }

}
