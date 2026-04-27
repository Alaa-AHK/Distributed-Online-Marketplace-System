import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _HttpClient:HttpClient) { }
  register(data:any):Observable<any>{
    return this._HttpClient.post('http://localhost:3000/user/register',data)
  }

  login(data:any):Observable<any>{
    return this._HttpClient.post('http://localhost:3000/user/login',data,{headers:new HttpHeaders({
      'Authorization':`Bearer ${localStorage.getItem("token")}`
    })})
    
  }
}
