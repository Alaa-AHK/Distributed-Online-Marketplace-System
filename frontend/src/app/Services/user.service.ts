import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _HttpClient:HttpClient) { }
  addAdmin(data:any):Observable<any>{
    const token = localStorage.getItem("Authorization") || '';
        const headers = new HttpHeaders().set('Authorization', token);
        return this._HttpClient.post('http://localhost:3000/user',data,{headers:headers});
  }
}
