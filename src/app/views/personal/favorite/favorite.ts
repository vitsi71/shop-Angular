import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {FavoriteService} from '../../../shared/services/favorite.service';
import {FavoriteType} from '../../../../types/favorite.type';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-favorite',
  standalone: false,
  templateUrl: './favorite.html',
  styleUrl: './favorite.scss',
})
export class Favorite implements OnInit {

  productsInFavorite: WritableSignal<FavoriteType[]> = signal<FavoriteType[]>([])

  serverStaticPath: string = environment.serverStaticPath;
  constructor(private favoriteService: FavoriteService) {
  }

  ngOnInit() {
    this.favoriteService.getFavorites()
      .subscribe((data: FavoriteType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.productsInFavorite.set(data as FavoriteType[]);
      })
  }

  removeFromFavorite(id:string){

  }
}
