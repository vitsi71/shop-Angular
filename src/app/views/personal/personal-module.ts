import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonalRoutingModule } from './personal-routing-module';
import { Favorite } from './favorite/favorite';
import { Info } from './info/info';
import { Orders } from './orders/orders';
import {SharedModule} from '../../shared/shared-module';

@NgModule({
  declarations: [Favorite, Info, Orders],
  imports: [CommonModule, PersonalRoutingModule,SharedModule],
})
export class PersonalModule {}
