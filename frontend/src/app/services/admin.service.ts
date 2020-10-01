import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  authToken: any;

  constructor(private http: HttpClient) { }

  getUsers() : Observable<any> {
    this.authToken = localStorage.getItem('id_token');
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', this.authToken);
    headers = headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:3000/users/getnonadmins', { headers: headers });
  }

  deleteUser(user: any) : Observable<any> {
    this.authToken = localStorage.getItem('id_token');
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', this.authToken);
    headers = headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/deleteuser', user, { headers: headers });
  }

  registerUser(user: any) : Observable<any> {
    this.authToken = localStorage.getItem('id_token');
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', this.authToken);
    headers = headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/register', user, { headers: headers });
  }

}
