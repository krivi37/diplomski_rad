import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  authToken: any;

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }

  getAllDocuments(conditions): Observable<any> {
    this.authToken = localStorage.getItem('id_token');
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', this.authToken);
    headers = headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/documents/getalldocuments', conditions, { headers: headers });
  }

  getUnarchivedDocuments(conditions): Observable<any> {
    this.authToken = localStorage.getItem('id_token');
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', this.authToken);
    headers = headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/documents/getunarchiveddocuments', conditions, { headers: headers });
  }

  addDocument(document): Observable<any>{
    this.authToken = localStorage.getItem('id_token');
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', this.authToken);
    headers = headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/documents/addnewdocument', document, { headers: headers });
  }

  archiveDocument(document): Observable<any> {
    this.authToken = localStorage.getItem('id_token');
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', this.authToken);
    headers = headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/documents/updatedocuments', {keys: document, params: document}, { headers: headers });
  }

}
