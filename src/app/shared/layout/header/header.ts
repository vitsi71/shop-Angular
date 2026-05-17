import {Component, HostListener, Input, OnInit, signal, WritableSignal} from '@angular/core';
import {AuthService} from '../../../core/auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {CategoryWithTypeType} from '../../../../types/category-with-type.type';
import {CartService} from '../../services/cart.service';
import {ProductService} from '../../services/product.service';
import {ProductType} from '../../../../types/product.type';
import {environment} from '../../../../environments/environment';
import {FormControl} from '@angular/forms';
import {debounceTime} from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})

export class Header implements OnInit {

  isLogged = signal<boolean>(false);
  @Input() categories = signal<CategoryWithTypeType[]>([]);
  count: WritableSignal<number> = signal<number>(0);
  showedSearch: WritableSignal<boolean> = signal<boolean>(false);
  products: WritableSignal<ProductType[]> = signal<ProductType[]>([]);
  searchField = new FormControl();
  serverStaticPath: string = environment.serverStaticPath;

  constructor(private cartService: CartService, private productService: ProductService, private authService: AuthService, private _snackBar: MatSnackBar, private router: Router) {
    this.isLogged.set(this.authService.getIsLoggedIn());
  }

  ngOnInit(): void {

    this.searchField.valueChanges // через FormControl подписываемся на изменения в input и
      .pipe(
        debounceTime(500) // задержка запроса на время набора данных абонентом(чтобы избежать частых запросов на backend)
      )
      .subscribe(value => {
        if (value && value.length > 2) { // отпрбатываем запрос к поиску
          this.productService.searchProducts(value)
            .subscribe((data: ProductType[]) => {
              this.products.set(data);
              this.showedSearch.set(true);
            })
        } else {
          this.products.set([]);
        }
      });

    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged.set(isLoggedIn);
    })
    this.cartService.getCartCount()
      .subscribe((data => {
        this.count.set((data as { count: number }).count);
      }))
    this.cartService.count$
      .subscribe((count => {
        this.count.set(count as number);
      }))


  }

  logout() {
    this.authService.logout()
      .subscribe();
    this.doLogout();

  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }

  selectProduct(url: string) {
    this.router.navigate(['product/' + url]);
    this.searchField.setValue('');
    this.products.set([]);

  }

  @HostListener('document:click', ['$event'])
  click(event: Event) { // обрабатываем клик по странице и если окно с элементами поиска открыто
    if (this.showedSearch() && (event.target as HTMLElement).className.indexOf('search-product') === -1) {
      this.showedSearch.set(false); // закрываем окно с поиском в ручную при клике мимо окна
    }
  }

}
