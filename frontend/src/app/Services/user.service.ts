import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = "http://localhost:3000/profile";

  constructor(private _HttpClient: HttpClient) {}

  // ✅ Get profile (correct endpoint = /profile)
  getMe(): Observable<any> {
    const token = localStorage.getItem("Authorization") || '';

    const headers = new HttpHeaders().set(
      'Authorization',
      token
    );

    return this._HttpClient.get(this.baseUrl, { headers });
  }

  // (اختياري - غالبًا مش هتستخدميه هنا)
  addAdmin(data: any): Observable<any> {
    const token = localStorage.getItem("Authorization") || '';

    const headers = new HttpHeaders().set(
      'Authorization',
      token
    );

    return this._HttpClient.post(`${this.baseUrl}`, data, { headers });
  }

updateUser(id: string, data: any): Observable<any> {
  const token = localStorage.getItem("Authorization") || '';

  const headers = new HttpHeaders().set(
    'Authorization',
    token
  );

  return this._HttpClient.patch(
    `http://localhost:3000/user/${id}`,
    data,
    { headers }
  );
}
 //updated
 getAllUsers(): Observable<any> {
  const token = localStorage.getItem("Authorization") || '';
  const headers = new HttpHeaders().set('Authorization', token);
  return this._HttpClient.get('http://localhost:3000/users/all', { headers });
}

  deleteUser(id: string): Observable<any> {
    const token = localStorage.getItem("Authorization") || '';

    const headers = new HttpHeaders().set(
      'Authorization',
      token
    );

    return this._HttpClient.delete(`http://localhost:3000/user/${id}`, { headers });
  }
}
