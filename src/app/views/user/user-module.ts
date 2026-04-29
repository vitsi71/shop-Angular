import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing-module';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared-module';

@NgModule({
  declarations: [Login, Signup],
  imports: [CommonModule, UserRoutingModule, ReactiveFormsModule, SharedModule],
})
export class UserModule {}
