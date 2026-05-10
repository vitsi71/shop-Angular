import { CanActivateFn } from '@angular/router';
import {AuthService} from './auth.service';
import {inject} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

export const authGuard: CanActivateFn = (route, state) => {

  const authService:AuthService=inject(AuthService);
const _snackBar: MatSnackBar = inject(MatSnackBar);
if(!authService.getIsLoggedIn()){
  _snackBar.open("Для доступа необходимо авторизоваться");
}
   return authService.getIsLoggedIn();
};
