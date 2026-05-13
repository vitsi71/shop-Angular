import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {ProductService} from '../../../shared/services/product.service';
import {ProductType} from '../../../../types/product.type';
import {CartService} from '../../../shared/services/cart.service';
import {CartType} from '../../../../types/cart.type';
import {environment} from '../../../../environments/environment';
import {DefaultResponseType} from '../../../../types/default-response.type';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart implements OnInit {

  extraProducts: WritableSignal<ProductType[]> = signal<ProductType[]>([]);
  cart: WritableSignal<CartType | null> = signal<CartType | null>(null);
  serverStaticPath: string = environment.serverStaticPath;
  totalAmount: number = 0;
  totalCount: number = 0;

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

  constructor(private productService: ProductService, private cartService: CartService) {
  }

  ngOnInit() {

    this.productService.getBestProducts()
      .subscribe((data: ProductType[]) => {
        this.extraProducts.set(data);
      })
    this.cartService.getCart()
      .subscribe((dataCart: CartType | DefaultResponseType) => {
        if ((dataCart as DefaultResponseType).error !== undefined) {
          throw new Error((dataCart as DefaultResponseType).message);
        }
        this.cart.set(dataCart as CartType);
        this.calculateTotal();
      })
  }

  calculateTotal() {
    this.totalAmount =0;
    this.totalCount=0;
    if (this.cart()) {
      this.cart()?.items.forEach(item => {
          this.totalAmount += item.quantity * item.product.price;
          this.totalCount += item.quantity;
        }
      )
    }
  }

  updateCount(id:string, count:number){
if(this.cart()){
  this.cartService.updateCart(id,count)
    .subscribe((data: CartType | DefaultResponseType) => {
      if ((data as DefaultResponseType).error !== undefined) {
        throw new Error((data as DefaultResponseType).message);
      }
      this.cart.set(data as CartType);
      this.calculateTotal();
    })
}
  }
}
