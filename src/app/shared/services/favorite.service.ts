import {Injectable} from '@angular/core';
import {Observable, Subject, tap} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {FavoriteType} from '../../../types/favorite.type';
import {DefaultResponseType} from '../../../types/default-response.type';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {

  favoriteProductIds: Set<string> = new Set<string>();
  favoriteStateChanged$: Subject<void> = new Subject<void>();

  constructor(private http: HttpClient) {
  }

  getFavorites(): Observable<FavoriteType[] | DefaultResponseType> {
    return this.http.get<FavoriteType[] | DefaultResponseType>(environment.api + 'favorites')
      .pipe(
        tap((data: FavoriteType[] | DefaultResponseType) => {
          if (!((data as DefaultResponseType).error !== undefined)) {
            this.syncLocalFavoriteState(data as FavoriteType[]);
          }
        })
      )
  }

  removeFavorite(productId: string): Observable<DefaultResponseType> {
    return this.http.delete<DefaultResponseType>(environment.api + 'favorites', {body: {productId}})
      .pipe(
        tap((data: DefaultResponseType) => {
          if (!data.error !== undefined) {
            this.favoriteProductIds.delete(productId);
            this.favoriteStateChanged$.next();
          }
        })
      );
       }

  addFavorite(productId: string): Observable<FavoriteType | DefaultResponseType> {
    return this.http.post<FavoriteType | DefaultResponseType>(environment.api + 'favorites', {productId})
      .pipe(
        tap((data: FavoriteType | DefaultResponseType) => {
          if (!((data as DefaultResponseType).error !== undefined)) {
            this.favoriteProductIds.add(productId)
            this.favoriteStateChanged$.next();
          }
        })
      );
  }

  isProductInFavorite(productId: string): boolean {
    return  this.favoriteProductIds.has(productId);
  }

  private syncLocalFavoriteState(data: FavoriteType[]) {
    this.favoriteProductIds.clear();
    data.forEach(item => {
      this.favoriteProductIds.add(item.id);
    });
    this.favoriteStateChanged$.next();
  }

}
