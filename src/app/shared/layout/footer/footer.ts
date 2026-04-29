import {Component, Input, signal} from '@angular/core';
import {CategoryType} from '../../../../types/category.type';
import {CategoryWithTypeType} from '../../../../types/category-with-type.type';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  // @Input()  categories: CategoryType[]=[];
  @Input()  categories =signal<CategoryWithTypeType[]>([]);

}
