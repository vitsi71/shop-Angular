import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordRepeatDirective } from './directives/password-repeat.directive';
import { ProductCard } from './components/product-card/product-card';
import { RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CategoryFilter} from './components/category-filter/category-filter';

@NgModule({
  declarations: [PasswordRepeatDirective, ProductCard, CategoryFilter],
  imports: [CommonModule, RouterModule, FormsModule],
  exports: [PasswordRepeatDirective, ProductCard, CategoryFilter],
})
export class SharedModule {}
