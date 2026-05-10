import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Layout} from './shared/layout/layout';
import {Main} from './views/main/main';
import {authForwardGuard} from './core/auth/auth-forward-guard';
import {authGuard} from './core/auth/auth.guard';

const routes: Routes = [
  {
    path:'',
    component:Layout,
    children:[
      {path:'',component:Main},
      {path:'',loadChildren:()=>
          import('./views/user/user-module').then(m=>m.UserModule),canActivate:[authForwardGuard]},
      {path:'',loadChildren:()=>
          import('./views/product/product-module').then(m=>m.ProductModule)},
      {path:'',loadChildren:()=>
          import('./views/order/order-module').then(m=>m.OrderModule)},
      {path:'',loadChildren:()=>
          import('./views/personal/personal-module').then(m=>m.PersonalModule),canActivate:[authGuard]}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
