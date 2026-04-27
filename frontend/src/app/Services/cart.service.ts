import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private _HttpClient:HttpClient) { }
  private checkoutItems: any[] = [];

setCheckoutItems(items: any[]) {
  this.checkoutItems = items;
}

getCheckoutItems(): any[] {
  return this.checkoutItems;
}

  addToCart(productId: string, quantity: number = 1): Observable<any> {
    return this._HttpClient.post('http://localhost:3000/cart', { productId, quantity });
  }
  getCart():Observable<any>{
    const token = localStorage.getItem("Authorization") || '';
    const headers = new HttpHeaders().set('Authorization', token);
    return this._HttpClient.get('http://localhost:3000/cart',{headers:headers});
  }
  postCart(data:any):Observable<any>{
    const token = localStorage.getItem("Authorization") || '';
    const headers = new HttpHeaders().set('Authorization', token);
    return this._HttpClient.post('http://localhost:3000/cart',data,{headers:headers})
  }
deleteItemInCart(productId: string | number): Observable<any> {
  return this._HttpClient.delete(`http://localhost:3000/cart/${productId}`,{
  headers: new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('token')}`
  })
});
}


updateCartQuantity(productId: string, quantity: number): Observable<any> {
  const token = localStorage.getItem("Authorization") || '';
  const headers = new HttpHeaders().set('Authorization', token);

  return this._HttpClient.put(
    `http://localhost:3000/cart/${productId}`,
    { quantity }, 
    { headers }
  );
}

deleteAllCart():Observable<any>{
    const token =localStorage.getItem("Authorization") || '';
    const headers=new HttpHeaders().set('Authorization', token);
    return this._HttpClient.delete(`http://localhost:3000/cart`,{headers:headers})
  }

}
