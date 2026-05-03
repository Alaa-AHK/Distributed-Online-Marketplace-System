import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseUrl = "http://localhost:3000/products";

  constructor(private _HttpClient: HttpClient) {}

  getproducts(): Observable<any> {
    return this._HttpClient.get(this.baseUrl);
  }

  postProduct(data: any): Observable<any> {
    const token = localStorage.getItem("Authorization") || '';
    const headers = new HttpHeaders().set('Authorization', token);

    return this._HttpClient.post(this.baseUrl, data, { headers });
  }

  deleteProduct(id: string): Observable<any> {
    const token = localStorage.getItem("Authorization") || '';
    const headers = new HttpHeaders().set('Authorization', token);

    return this._HttpClient.delete(`${this.baseUrl}/${id}`, { headers });
  }

  updateProduct(id: string, data: any): Observable<any> {
    const token = localStorage.getItem("Authorization") || '';
    const headers = new HttpHeaders().set('Authorization', token);

    return this._HttpClient.patch(`${this.baseUrl}/${id}`, data, { headers });
  }

  getSingleProduct(id: string): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/${id}`);
  }

  rateProduct(productId: string, ratingData: any): Observable<any> {
    const token = localStorage.getItem("Authorization") || '';
    const headers = new HttpHeaders().set('Authorization', token);

    return this._HttpClient.post(
      `${this.baseUrl}/${productId}/rate`,
      ratingData,
      { headers }
    );
  }
}