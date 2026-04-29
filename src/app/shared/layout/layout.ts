import {Component, OnInit, signal} from '@angular/core';
import {CategoryType} from '../../../types/category.type';
import {CategoryService} from '../services/category.service';
import {CategoryWithTypeType} from '../../../types/category-with-type.type';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.html',
})
export class Layout implements OnInit{

  // categories: CategoryType[]=[];
  categories =signal<CategoryWithTypeType[]>([]);

  constructor(private categoryService:CategoryService) {  }

  ngOnInit():void{
    this.categoryService.getCategoriesWithTypes()
      .subscribe((categories: CategoryWithTypeType[])=>{
        this.categories.set (categories.map(item=>{
return Object.assign({typesUrl:item.types.map(item=>item.url)},item);
        }));
      })
  }
}
