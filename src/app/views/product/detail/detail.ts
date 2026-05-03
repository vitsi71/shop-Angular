import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {ProductType} from '../../../../types/product.type';
import {ProductService} from '../../../shared/services/product.service';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {CartType} from '../../../../types/cart.type';
import {CartService} from '../../../shared/services/cart.service';

@Component({
  selector: 'app-detail',
  standalone: false,
  templateUrl: './detail.html',
  styleUrl: './detail.scss',
})
export class Detail implements OnInit {

  recommendedProducts: WritableSignal<ProductType[]> = signal<ProductType[]>([]);
  product: WritableSignal<ProductType | null> = signal<ProductType | null>(null);
  serverStaticPath: string = environment.serverStaticPath; //шаблон URL для запроса картинки в HTML

  isInCart: WritableSignal<boolean> = signal<boolean>(false)
  count: number = 1;

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

  constructor(private productService: ProductService, private cartService: CartService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.isInCart.set(false);
    this.activatedRoute.params.subscribe(params => {
      this.productService.getProduct(params['url'])
        .subscribe((data: ProductType) => {

          this.cartService.getCart()
            .subscribe((dataCart: CartType) => {
              if (dataCart) {
                const productInCart = dataCart.items.find(item => item.product.id === data.id)

                if (productInCart) {
                  data.countInCart = productInCart.quantity;
                  this.count=data.countInCart;
                }
              }
              this.product.set(data);
            })
        })

    })


    this.productService.getBestProducts()
      .subscribe((data: ProductType[]) => {
        this.recommendedProducts.set(data);
      })
  }

  updateCount(value: number) {
    this.count = value
    if (this.product()?.countInCart) {
      // this.product()!.countInCart = this.count;
      this.cartService.updateCart(this.product()!.id, this.count)
        .subscribe((data: CartType) => {

          this.product()!.countInCart=this.count;
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
        this.product()!.countInCart=0;
        // this.isInCart.set(0);
        this.isInCart.set(false);

      })
  }

}
