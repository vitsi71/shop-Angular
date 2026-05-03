import {Component, Input, OnInit, signal, WritableSignal} from '@angular/core';
import {ProductType} from '../../../../types/product.type';
import {environment} from '../../../../environments/environment';
import {CartService} from '../../services/cart.service';
import {CartType} from '../../../../types/cart.type';

@Component({
  selector: 'app-product-card',
  standalone: false,
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard implements OnInit{

  @Input() product!: ProductType;
  serverStaticPath: string = environment.serverStaticPath;
  count: number = 1;
  @Input() isLite: boolean = false;
  @Input() countInCart: number | undefined=0;
  isInCart: WritableSignal<boolean> = signal<boolean>(false)
  // isInCart: WritableSignal<number | undefined> = signal<number | undefined>(0)


  constructor(private cartService:CartService ) {
  }

  ngOnInit() {
    if (this.countInCart){
      this.count=this.countInCart;
      // this.isInCart.set(this.count);
      this.isInCart.set(true);
    }
  }

  addToCart() {
    this.cartService.updateCart(this.product.id, this.count)
      .subscribe((data: CartType) => {
        // this.isInCart.set(this.count);
        this.isInCart.set(true);
        this.countInCart=this.count;
      })
  }

  updateCount(value: number) {
    this.count = value;
    if (this.isInCart()) {
      this.cartService.updateCart(this.product.id, this.count)
        .subscribe((data: CartType) => {
          this.countInCart=this.count;
          // this.isInCart.set(this.count);
          this.isInCart.set(true);
        })
    }
  }

  removeFromCart() {
    this.cartService.updateCart(this.product.id, 0)
      .subscribe((data: CartType) => {
        this.countInCart=0;
        // this.isInCart.set(0);
        this.isInCart.set(false);
        this.count = 1;
      })
  }

}
