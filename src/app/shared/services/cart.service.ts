import { Injectable } from '@angular/core';
import {Observable, Subject, tap} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {CartType} from '../../../types/cart.type';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  count:number=0;
  count$:Subject<number>=new Subject<number>();
  cartStateChanged$: Subject<void> = new Subject<void>();
  private cartProductQuantities: Map<string, number> = new Map<string, number>();

  constructor(private http:HttpClient) {
  }
  getCart():Observable<CartType>{
    return this.http.get<CartType>(environment.api + 'cart',{withCredentials:true})
      .pipe(
        tap(data => {
          this.syncLocalCartState(data);
        })
      );
    //{withCredentials:true}  это параметр, который указывает браузеру включать учётные данные
    // (cookies, авторизационные заголовки, TLS-сертификаты) в кросс-доменные HTTP-запросы
  }
  getCartCount():Observable<{ count: number }>{
    return this.http.get<{ count: number }>(environment.api + 'cart/count',{withCredentials:true})
      .pipe(
        tap(data =>{
          this.count=data.count;
          this.count$.next(this.count);
        })
      );
    //{withCredentials:true}  это параметр, который указывает браузеру включать учётные данные
    // (cookies, авторизационные заголовки, TLS-сертификаты) в кросс-доменные HTTP-запросы
  }
  updateCart(productId:string,quantity:number):Observable<CartType>{
    return this.http.post<CartType>(environment.api + 'cart',{productId,quantity},{withCredentials:true})
      .pipe(
        tap(data =>{
          this.syncLocalCartState(data);
        })
      );
  }

  isProductInCart(productId: string): boolean {
    return  this.cartProductQuantities.has(productId);
    // return this.cartProductIds.has(productId);
  }

  getProductQuantity(productId: string): number {
    return this.cartProductQuantities.get(productId) ?? 0;
  }

  private syncLocalCartState(data: CartType) {
    this.count = 0;
    // this.cartProductIds.clear();
    this.cartProductQuantities.clear();
    data.items.forEach(item => {
      this.count += item.quantity;
      // this.cartProductIds.add(item.product.id);
      this.cartProductQuantities.set(item.product.id, item.quantity);
    });
    this.count$.next(this.count);
    this.cartStateChanged$.next();
  }
}
