import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Layout } from './shared/layout/layout';
import { Header } from './shared/layout/header/header';
import { Footer } from './shared/layout/footer/footer';
import { Main } from './views/main/main';
import {HTTP_INTERCEPTORS, HttpInterceptorFn, provideHttpClient, withInterceptors} from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { SharedModule } from './shared/shared-module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import {authInterceptor} from './core/auth/auth-interceptor';

@NgModule({
  declarations: [App, Layout, Header, Footer, Main],
  imports: [
    BrowserModule,
    MatSnackBarModule,
    MatMenuModule,
    SharedModule,
    CarouselModule,
    AppRoutingModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
  bootstrap: [App],
})
export class AppModule {}
