import {Component, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {FavoriteService} from '../../../shared/services/favorite.service';
import {FavoriteInCartType, FavoriteType} from '../../../../types/favorite.type';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {environment} from '../../../../environments/environment';
import {CartType} from '../../../../types/cart.type';
import {CartService} from '../../../shared/services/cart.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-favorite',
  standalone: false,
  templateUrl: './favorite.html',
  styleUrl: './favorite.scss',
})
export class Favorite implements OnInit, OnDestroy {

  productsInFavorite: WritableSignal<FavoriteInCartType[]> = signal<FavoriteInCartType[]>([])

  serverStaticPath: string = environment.serverStaticPath;
  private cartStateSubscription: Subscription | null = null;
  private favoriteStateSubscription: Subscription | null = null;

  constructor(private favoriteService: FavoriteService, private cartService: CartService) {

  }

  ngOnInit() {


    this.favoriteStateSubscription = this.favoriteService.getFavorites()
      .subscribe((data: FavoriteType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        const favorites = data as FavoriteType[];
        this.cartStateSubscription = this.cartService.getCart().subscribe(() => {
          this.productsInFavorite.set(favorites.map((item: FavoriteType): FavoriteInCartType => ({
            ...item,
            countInCart: this.cartService.getProductQuantity(item.id)
          })))
        });

      })
  }

  ngOnDestroy() {
    this.cartStateSubscription?.unsubscribe();
    this.favoriteStateSubscription?.unsubscribe();
  }


  removeFromFavorite(id: string) {
    this.favoriteService.removeFavorite(id)
      .subscribe((data: DefaultResponseType) => {
        if (data.error) {
          throw new Error(data.message);
        }
        this.productsInFavorite.set(this.productsInFavorite().filter(item => item.id !== id)); // оставляет все, что соответствует условию
      })

  }


  updateCount(id: string, value: number) {

    this.cartService.updateCart(id, value)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.syncProductsInFavoriteWithCart();
      })
  }

  addToCart(id: string) {
    this.cartService.updateCart(id, 1)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.syncProductsInFavoriteWithCart();
      })

  }

  removeFromCart(id: string) {
    this.cartService.updateCart(id, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.syncProductsInFavoriteWithCart();
      })
  }

  syncProductsInFavoriteWithCart() {
    this.productsInFavorite.set(this.productsInFavorite().map(item => ({
      ...item,
      countInCart: this.cartService.getProductQuantity(item.id)
    })))
  }
}
