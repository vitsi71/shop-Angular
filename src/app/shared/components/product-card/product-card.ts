import {Component, Input} from '@angular/core';
import {ProductType} from '../../../../types/product.type';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-product-card',
  standalone: false,
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {

 @Input() product!:ProductType;
  serverStaticPath:string=environment.serverStaticPath;
count:number=1;
}
