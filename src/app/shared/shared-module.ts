import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PasswordRepeatDirective} from './directives/password-repeat.directive';
import {ProductCard} from './components/product-card/product-card';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CategoryFilter} from './components/category-filter/category-filter';
import {CountSelector} from './components/count-selector/count-selector';
import {Loader} from './components/loader/loader';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [PasswordRepeatDirective, ProductCard, CategoryFilter, CountSelector, Loader],
  imports: [CommonModule, RouterModule, FormsModule, MatProgressSpinnerModule],
  exports: [PasswordRepeatDirective, ProductCard, CategoryFilter, CountSelector, Loader],
})
export class SharedModule {}
