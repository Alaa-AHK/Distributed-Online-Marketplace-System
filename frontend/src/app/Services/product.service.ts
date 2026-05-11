import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseUrl = "http://localhost:3000";

  constructor(private _HttpClient: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem("Authorization") || '';
    return new HttpHeaders().set('Authorization', token);
  }

  // Get all products
  getproducts(): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/products`);
  }

  // Search products
  searchProducts(keyword: string): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}/products/search?keyword=${keyword}`
    );
  }

  // Create product
  postProduct(data: any): Observable<any> {
    return this._HttpClient.post(
      `${this.baseUrl}/product`,
      data,
      { headers: this.getHeaders() }
    );
  }

  // Delete product
  deleteProduct(id: string): Observable<any> {
    return this._HttpClient.delete(
      `${this.baseUrl}/product/${id}`,
      { headers: this.getHeaders() }
    );
  }

  // Update product (PATCH)
  updateProduct(id: string, data: any): Observable<any> {
    return this._HttpClient.patch(
      `${this.baseUrl}/product/${id}`,
      data,
      { headers: this.getHeaders() }
    );
  }

  // Get single product
  getSingleProduct(id: string): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}/product/${id}`
    );
  }

  // Rate product
  rateProduct(productId: string, ratingData: any): Observable<any> {
    return this._HttpClient.post(
      `${this.baseUrl}/product/${productId}/rate`,
      ratingData,
      { headers: this.getHeaders() }
    );
  }
  // Get my products
getMyProducts(): Observable<any> {
  return this._HttpClient.get(
    `${this.baseUrl}/my-products`,
    { headers: this.getHeaders() }
  );
}
}
