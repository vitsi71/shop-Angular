import {Component, Input, OnInit, signal, WritableSignal} from '@angular/core';
import {CategoryType} from '../../../../types/category.type';
import {AuthService} from '../../../core/auth/auth.service';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {CategoryWithTypeType} from '../../../../types/category-with-type.type';
import {CartService} from '../../services/cart.service';

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

  constructor(private cartService: CartService, private authService: AuthService, private _snackBar: MatSnackBar, private router: Router) {
    this.isLogged.set(this.authService.getIsLoggedIn());
  }

  ngOnInit(): void {
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged.set(isLoggedIn);
    })
    this.cartService.getCartCount()
      .subscribe((data => {
        this.count.set(data.count);
      }))
    this.cartService.count$
      .subscribe((count => {
        this.count.set(count);
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


}
