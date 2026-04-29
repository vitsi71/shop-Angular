import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {CategoryType} from '../../../types/category.type';
import {map, Observable} from "rxjs";
import {environment} from '../../../environments/environment';
import {TypeType} from '../../../types/type.type';
import {CategoryWithTypeType} from '../../../types/category-with-type.type';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {

  constructor(private http:HttpClient) {
  }

  getCategories():Observable<CategoryType[]>{
return this.http.get<CategoryType[]>(environment.api + 'categories');
  }
  getCategoriesWithTypes():Observable<CategoryWithTypeType[]>{
return this.http.get<TypeType[]>(environment.api + 'types')
  .pipe(
    map((items:TypeType[])=>{
      const arr:CategoryWithTypeType[]=[];
items.forEach((item:TypeType)=>{

  const foundItem=arr.find(arrItem=>arrItem.url===item.category.url);

  if(foundItem){
    foundItem.types.push({
      id: item.id,
      name: item.name,
      url: item.url
    });
  } else {
    arr.push({
      id: item.category.id,
      name: item.category.name,
      url: item.category.url,
      types: [{
        id: item.id,
        name: item.name,
        url: item.url
      }]
    })
  }

})
      return arr;
    })
  );
  }
}
