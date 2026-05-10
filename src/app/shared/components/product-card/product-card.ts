import {Component, Input, OnChanges, OnDestroy, OnInit, signal, SimpleChanges, WritableSignal} from '@angular/core';
import {ProductType} from '../../../../types/product.type';
import {environment} from '../../../../environments/environment';
import {CartService} from '../../services/cart.service';
import {CartType} from '../../../../types/cart.type';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-product-card',
  standalone: false,
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard implements OnInit, OnChanges, OnDestroy {

  @Input() product!: ProductType;
  serverStaticPath: string = environment.serverStaticPath;
  count: number = 1;
  @Input() isLite: boolean = false;
  @Input() countInCart: number | undefined = 0;
  isInCart: WritableSignal<boolean> = signal<boolean>(false);
  private cartStateSubscription: Subscription | null = null;


  constructor(private cartService:CartService ) {
  }

  ngOnInit() {
    this.syncCartState();
    this.cartStateSubscription = this.cartService.cartStateChanged$.subscribe(() => {
      this.countInCart = this.cartService.getProductQuantity(this.product.id);
      this.product.countInCart = this.countInCart;
      this.syncCartState();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['countInCart'] || changes['product']) {
      this.syncCartState();
    }
  }

  ngOnDestroy() {
    this.cartStateSubscription?.unsubscribe();
  }

  addToCart() {
    this.cartService.updateCart(this.product.id, this.count)
      .subscribe((data: CartType) => {
        this.countInCart = this.count;
        this.product.countInCart = this.count;
        this.isInCart.set(true);
      })
  }

  updateCount(value: number) {
    this.count = value;
    if (this.isInCart()) {
      this.cartService.updateCart(this.product.id, this.count)
        .subscribe((data: CartType) => {
          this.countInCart = this.count;
          this.product.countInCart = this.count;
          this.isInCart.set(true);
        })
    }
  }

  removeFromCart() {
    this.cartService.updateCart(this.product.id, 0)
      .subscribe((data: CartType) => {
        this.countInCart = 0;
        this.product.countInCart = 0;
        this.count = 1;
        this.isInCart.set(false);
      })
  }

  private syncCartState() {
    if (this.countInCart && this.countInCart > 0) {
      this.count = this.countInCart ?? 1;
      this.isInCart.set(true);
      return;
    }

    this.count = 1;
    this.isInCart.set(false);
  }

}
