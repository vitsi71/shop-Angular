import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Favorite} from './favorite/favorite';
import {Info} from './info/info';
import {Orders} from './orders/orders';

const routes: Routes = [
  {path:'favorite',component:Favorite},
  {path:'info',component:Info},
  {path:'orders',component:Orders},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonalRoutingModule {}
