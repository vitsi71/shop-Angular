import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing-module';
import { Cart } from './cart/cart';
import { Order } from './order/order';
import {SharedModule} from '../../shared/shared-module';
import {CarouselModule} from 'ngx-owl-carousel-o';

@NgModule({
  declarations: [Cart, Order],
  imports: [CommonModule, OrderRoutingModule, SharedModule, CarouselModule],
})
export class OrderModule {}
