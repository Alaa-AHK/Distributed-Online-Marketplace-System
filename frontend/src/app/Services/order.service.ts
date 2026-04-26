import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseUrl = 'http://localhost:3000';

  constructor(private _HttpClient: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem("Authorization") || '';
    return new HttpHeaders().set('Authorization', token);
  }


  getUserOrders(): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/order`, { headers: this.getAuthHeaders() });
  }


  getAllOrders(): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/orders`, { headers: this.getAuthHeaders() });
  }


  postOrder(data: any): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/order`, data, { headers: this.getAuthHeaders() });
  }


  deleteOrder(id: string | number): Observable<any> {
    return this._HttpClient.delete(`${this.baseUrl}/order/${id}`, { headers: this.getAuthHeaders() });
  }


  updateOrderStatus(id: string | number, data: any): Observable<any> {
    return this._HttpClient.put(`${this.baseUrl}/order/${id}`, data, { headers: this.getAuthHeaders() });
  }
}
