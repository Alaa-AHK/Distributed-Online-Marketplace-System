import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _HttpClient: HttpClient) {}

  // 👇 ROLE STATE
  private roleSubject = new BehaviorSubject<string | null>(this.getRole());
  role$ = this.roleSubject.asObservable();

  // 👇 UPDATE ROLE
  setRole(role: string) {
    this.roleSubject.next(role);
  }

  // 👇 READ ROLE FROM TOKEN
  getRole(): string | null {
    const token = localStorage.getItem('Authorization');

    if (!token) return null;

    try {
      const pureToken = token.split(' ')[1];
      const decoded: any = JSON.parse(atob(pureToken.split('.')[1]));

      return decoded.role;
    } catch {
      return null;
    }
  }

  register(data: any): Observable<any> {
    return this._HttpClient.post('http://localhost:3000/user/register', data);
  }

  login(data: any): Observable<any> {
    return this._HttpClient.post('http://localhost:3000/user/login', data);
  }
}
