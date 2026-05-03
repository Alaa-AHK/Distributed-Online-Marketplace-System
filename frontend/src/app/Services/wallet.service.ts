import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  baseUrl = "http://localhost:3000";

  constructor(private http: HttpClient) {}

  getMyWallet(): Observable<any> {
    const token = localStorage.getItem("Authorization") || '';

    const headers = new HttpHeaders().set(
      'Authorization',
      token
    );

    return this.http.get(`${this.baseUrl}/mywallet`, { headers });
  }
  deposit(amount: number): Observable<any> {
  const token = localStorage.getItem("Authorization") || '';

  const headers = new HttpHeaders().set(
    'Authorization',
    token
  );

  return this.http.post(
    `${this.baseUrl}/deposit`,  { amount }, { headers },


  );
}
}
