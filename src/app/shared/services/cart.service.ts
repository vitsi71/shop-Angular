import {Injectable} from '@angular/core';
import {Observable, Subject, tap} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {CartType} from '../../../types/cart.type';
import {DefaultResponseType} from '../../../types/default-response.type';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  private count: number = 0;
  count$: Subject<number> = new Subject<number>();
  cartStateChanged$: Subject<void> = new Subject<void>();
  private cartProductQuantities: Map<string, number> = new Map<string, number>();

  constructor(private http: HttpClient) {
  }

  getCart(): Observable<CartType | DefaultResponseType> {
    return this.http.get<CartType | DefaultResponseType>(environment.api + 'cart', {withCredentials: true})
      .pipe(
        tap(data => {
          if (!data.hasOwnProperty('error')) {
            this.syncLocalCartState(data as CartType);
          }
        })
      );
    //{withCredentials:true}  это параметр, который указывает браузеру включать учётные данные
    // (cookies, авторизационные заголовки, TLS-сертификаты) в кросс-доменные HTTP-запросы
  }

  setCount(count: number) {
    this.count = count;
    this.count$.next(count);
  }

  getCartCount(): Observable<{ count: number } | DefaultResponseType> {
    return this.http.get<{
      count: number
    } | DefaultResponseType>(environment.api + 'cart/count', {withCredentials: true})
      .pipe(
        tap((data: { count: number } | DefaultResponseType) => {
          if (!data.hasOwnProperty('error')) {
            this.setCount(this.count);
          }
        })
      );
    //{withCredentials:true}  это параметр, который указывает браузеру включать учётные данные
    // (cookies, авторизационные заголовки, TLS-сертификаты) в кросс-доменные HTTP-запросы
  }

  updateCart(productId: string, quantity: number): Observable<CartType | DefaultResponseType> {
    return this.http.post<CartType | DefaultResponseType>(environment.api + 'cart', {
      productId,
      quantity
    }, {withCredentials: true})
      .pipe(
        tap(data => {
          if (!data.hasOwnProperty('error')) {
            this.syncLocalCartState(data as CartType);
          }
        })
      );
  }

  isProductInCart(productId: string): boolean {
    return this.cartProductQuantities.has(productId);
  }

  getProductQuantity(productId: string): number {
    return this.cartProductQuantities.get(productId) ?? 0;
  }

  private syncLocalCartState(data: CartType) {
    let count = 0;
    this.cartProductQuantities.clear();
    data.items.forEach(item => {
      count += item.quantity;
      this.cartProductQuantities.set(item.product.id, item.quantity);
    });
    this.setCount(count);
    this.cartStateChanged$.next();
  }
}
