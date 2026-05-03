import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordRepeatDirective } from './directives/password-repeat.directive';
import { ProductCard } from './components/product-card/product-card';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoryFilter } from './components/category-filter/category-filter';
import { CountSelector } from './components/count-selector/count-selector';

@NgModule({
  declarations: [PasswordRepeatDirective, ProductCard, CategoryFilter, CountSelector],
  imports: [CommonModule, RouterModule, FormsModule],
  exports: [PasswordRepeatDirective, ProductCard, CategoryFilter, CountSelector],
})
export class SharedModule {}
