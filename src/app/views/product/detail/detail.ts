import {Component, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {ProductType} from '../../../../types/product.type';
import {ProductService} from '../../../shared/services/product.service';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {CartType} from '../../../../types/cart.type';
import {CartService} from '../../../shared/services/cart.service';
import {Subscription} from 'rxjs';
import {FavoriteService} from '../../../shared/services/favorite.service';
import {FavoriteType} from '../../../../types/favorite.type';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {AuthService} from '../../../core/auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-detail',
  standalone: false,
  templateUrl: './detail.html',
  styleUrl: './detail.scss',
})
export class Detail implements OnInit, OnDestroy {

  recommendedProducts: WritableSignal<ProductType[]> = signal<ProductType[]>([]);
  product: WritableSignal<ProductType | null> = signal<ProductType | null>(null);
  serverStaticPath: string = environment.serverStaticPath; //шаблон URL для запроса картинки в HTML

  isInCart: WritableSignal<boolean> = signal<boolean>(false)
  isInFavorite: WritableSignal<boolean> = signal<boolean>(false)
  count: number = 1;
  private cartStateSubscription: Subscription | null = null;

  // настройки для карусели продуктов
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 24, // настройка расстояния между слайдами за счет сдвига последнего слайда
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: false
  }

  constructor(private _snackBar: MatSnackBar, private authService: AuthService, private favoriteService: FavoriteService, private productService: ProductService, private cartService: CartService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.cartStateSubscription = this.cartService.cartStateChanged$.subscribe(() => {
      this.syncCurrentProductWithCart();
      this.syncRecommendedProductsWithCart();
    });

    this.activatedRoute.params.subscribe(params => {
      this.productService.getProduct(params['url'])
        .subscribe((data: ProductType) => {
          this.product.set(data);
          this.cartService.getCart()
            .subscribe((dataCart: CartType) => {
              const quantityInCart = this.cartService.getProductQuantity(data.id);
              this.product()!.countInCart = quantityInCart;
              this.count = quantityInCart > 0 ? quantityInCart : 1;
              this.isInCart.set(this.cartService.isProductInCart(data.id));
              this.syncRecommendedProductsWithCart();
            })
          if (this.authService.getIsLoggedIn()) {
            this.favoriteService.getFavorites()
              .subscribe((data: FavoriteType[] | DefaultResponseType) => {
                if ((data as DefaultResponseType).error !== undefined) {
                  throw new Error((data as DefaultResponseType).message);
                }
                const productsInFavorite = data as FavoriteType[];
                const currentProductExist: FavoriteType | undefined = productsInFavorite.find(item => item.id === this.product()!.id)
                if (currentProductExist) {
                  this.product()!.isInFavorite = true;
                  this.isInFavorite.set(true);
                }

              })
          }
        })
    })


    this.productService.getBestProducts()
      .subscribe((data: ProductType[]) => {
        this.recommendedProducts.set(data.map(product => {
          product.countInCart = this.cartService.getProductQuantity(product.id);
          return product;
        }));
      })
  }

  ngOnDestroy() {
    this.cartStateSubscription?.unsubscribe();
  }

  updateCount(value: number) {
    this.count = value
    if (this.product()?.countInCart) {
      // this.product()!.countInCart = this.count;
      this.cartService.updateCart(this.product()!.id, this.count)
        .subscribe((data: CartType) => {

          this.product()!.countInCart = this.count;
          // this.isInCart.set(this.count);
          this.isInCart.set(true);
        })
    }
  }

  addToCart() {
    // this.product()!.countInCart = this.count;
    this.cartService.updateCart(this.product()!.id, this.count)
      .subscribe((data: CartType) => {

        this.product()!.countInCart = this.count;
        this.isInCart.set(true);
        // console.log(this.product()?.countInCart);
      })

  }

  removeFromCart() {
    // this.product()!.countInCart = 0;
    this.count = 1;
    this.cartService.updateCart(this.product()!.id, 0)
      .subscribe((data: CartType) => {
        this.product()!.countInCart = 0;
        // this.isInCart.set(0);
        this.isInCart.set(false);

      })
  }

  private syncRecommendedProductsWithCart() {
    this.recommendedProducts.set(this.recommendedProducts().map(product => {
      product.countInCart = this.cartService.getProductQuantity(product.id);
      return product;
    }));
  }

  private syncCurrentProductWithCart() {
    const currentProduct = this.product();
    if (!currentProduct) {
      return;
    }

    const quantityInCart = this.cartService.getProductQuantity(currentProduct.id);
    currentProduct.countInCart = quantityInCart;
    this.count = quantityInCart > 0 ? quantityInCart : 1;
    this.isInCart.set(this.cartService.isProductInCart(currentProduct.id));
    this.product.set({...currentProduct});
  }

  updateFavorite() {

    if (!this.authService.getIsLoggedIn()) {
      this._snackBar.open("Для добавления в избранное необходимо авторизоваться");
      return;
    }
    if (this.isInFavorite()) {
      this.favoriteService.removeFavorite(this.product()!.id)
        .subscribe((data: DefaultResponseType) => {
          if (data.error) {
            throw new Error(data.message);
          }
          this.product()!.isInFavorite = false;
          this.isInFavorite.set(false);
        })
    } else {
      this.favoriteService.addFavorite(this.product()!.id)
        .subscribe((data: FavoriteType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }
          this.product()!.isInFavorite = true;
          this.isInFavorite.set(true);

        })
    }
  }


}
