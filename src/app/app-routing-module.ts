import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Layout} from './shared/layout/layout';
import {Main} from './views/main/main';

const routes: Routes = [
  {
    path:'',
    component:Layout,
    children:[
      {path:'',component:Main},
      {path:'',loadChildren:()=>
          import('./views/user/user-module').then(m=>m.UserModule)},
      {path:'',loadChildren:()=>
          import('./views/product/product-module').then(m=>m.ProductModule)},
      {path:'',loadChildren:()=>
          import('./views/order/order-module').then(m=>m.OrderModule)}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
