import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private _HttpClient:HttpClient) { }
  
  getproducts():Observable<any>{
    return this._HttpClient.get('http://localhost:3000/product');
  }

  postProduct(data:any):Observable<any>{
     const token = localStorage.getItem("Authorization") || '';
    const headers = new HttpHeaders().set('Authorization', token);
    return this._HttpClient.post('http://localhost:3000/product',data,{headers:headers});
  }

  deleteProduct(id: string | number): Observable<any> {
    const token = localStorage.getItem("Authorization") || '';
    const headers = new HttpHeaders().set('Authorization', token);
  return this._HttpClient.delete(`http://localhost:3000/product/${id}`,{headers:headers});
}

updateProduct(id: string | number, data: any): Observable<any> {
  const token = localStorage.getItem("Authorization") || '';
    const headers = new HttpHeaders().set('Authorization', token);
  return this._HttpClient.patch(`http://localhost:3000/product/${id}`, data,{headers:headers});
}
getSingleProduct(id: string) :Observable<any>{
    return this._HttpClient.get(`http://localhost:3000/product/${id}`);
  }

rateProduct(productId: string, ratingData: any):Observable<any> {
    return this._HttpClient.post(`http://localhost:3000/product/${productId}/rate`, ratingData);
  }

}
