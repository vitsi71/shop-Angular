import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {OrderService} from '../../../shared/services/order.service';
import {OrderType} from '../../../../types/order.type';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {OrderStatusUtil} from '../../../shared/utils/order-status.util';

@Component({
  selector: 'app-orders',
  standalone: false,
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders implements OnInit {
  orders: WritableSignal<OrderType[]> = signal<OrderType[]>([]);
  constructor(private orderService: OrderService) {
  }

  ngOnInit() {

    this.orderService.getOrders()
      .subscribe((data: OrderType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.orders.set((data as OrderType[]).map(item => {
          const status = OrderStatusUtil.getStatusAndColor(item.status);
          item.statusRus = status.name;
          item.color = status.color;
          return item;
        }))
      });
  }

}
