import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseUrl = "http://localhost:3000";

  constructor(private _HttpClient: HttpClient) {}

  // Get all products
  getproducts(): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/products`);
  }

  // Create product
postProduct(data: any): Observable<any> {
  const token = localStorage.getItem("Authorization") || '';
  const headers = new HttpHeaders().set('Authorization', token);

  return this._HttpClient.post(
    `${this.baseUrl}/product`,
    data,
    { headers }
  );
}


  // Delete product
  deleteProduct(id: string): Observable<any> {
    const token = localStorage.getItem("Authorization") || '';
    const headers = new HttpHeaders().set('Authorization', token);

    return this._HttpClient.delete(`${this.baseUrl}/product/${id}`, { headers });
  }

  // Update product
  updateProduct(id: string, data: any): Observable<any> {
    const token = localStorage.getItem("Authorization") || '';
    const headers = new HttpHeaders().set('Authorization', token);

    return this._HttpClient.patch(`${this.baseUrl}/product/${id}`, data, { headers });
  }
  getSingleProduct(id: string): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/product/${id}`);
  }

  // Rate product
  rateProduct(productId: string, ratingData: any): Observable<any> {
    const token = localStorage.getItem("Authorization") || '';
    const headers = new HttpHeaders().set('Authorization', token);

    return this._HttpClient.post(
      `${this.baseUrl}/product/${productId}/rate`,
      ratingData,
      { headers }
    );
  }
}
