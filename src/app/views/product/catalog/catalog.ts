
import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {ProductService} from '../../../shared/services/product.service';
import {ProductType} from '../../../../types/product.type';
import {CategoryService} from '../../../shared/services/category.service';
import {CategoryWithTypeType} from '../../../../types/category-with-type.type';
import {ActivatedRoute, Router} from '@angular/router';
import {ActiveParamsUtil} from '../../../shared/utils/active-params.util';
import {ActiveParamsType} from '../../../../types/active-params.type';
import {AppliedFilterType} from '../../../../types/applied-filter.type';
import {debounceTime} from 'rxjs';
import {CartService} from '../../../shared/services/cart.service';
import {CartType} from '../../../../types/cart.type';
import {AuthService} from '../../../core/auth/auth.service';
import {FavoriteService} from '../../../shared/services/favorite.service';
import {FavoriteType} from '../../../../types/favorite.type';
import {DefaultResponseType} from '../../../../types/default-response.type';

@Component({
  selector: 'app-catalog',
  standalone: false,
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss',
})
export class Catalog implements OnInit {

  products: WritableSignal<ProductType[]> = signal<ProductType[]>([]);
  categoriesWithTypes: WritableSignal<CategoryWithTypeType[]> = signal<CategoryWithTypeType[]>([]);

  activeParams: ActiveParamsType = {types: []};
  appliedFilters: AppliedFilterType[] = [];

  sortingOpen: boolean = false;
  sortingOptions: { name: string, value: string }[] = [
    {name: 'От А до Я', value: 'az-asc'},
    {name: 'От Я до А', value: 'az-desc'},
    {name: 'По возрастанию цены', value: 'price-asc'},
    {name: 'По убыванию цены', value: 'price-desc'},
  ];

  pages: number[] = [];
  cart: WritableSignal<CartType | null> = signal<CartType | null>(null);
  productsInFavorite: WritableSignal<FavoriteType[] | null> = signal<FavoriteType[] | null>(null);

  constructor(private authService: AuthService, private favoriteService: FavoriteService, private productService: ProductService, private categoryService: CategoryService,
              private router: Router, private activatedRoute: ActivatedRoute, private cartService: CartService) {
  }

  ngOnInit() {

    this.cartService.getCart()
      .subscribe((dataCart: CartType) => {
        this.cart.set(dataCart);
        if (this.authService.getIsLoggedIn()) {
          this.favoriteService.getFavorites()
            .subscribe({
                next: (data: FavoriteType[] | DefaultResponseType) => {
                  if ((data as DefaultResponseType).error !== undefined) {
                    this.processCatalog();
                    throw new Error((data as DefaultResponseType).message);
                  }
                  this.productsInFavorite.set(data as FavoriteType[]);
                  this.processCatalog();
                },
                error: (error) => {
                  this.processCatalog();
                }
              }
            )
        } else {
          this.processCatalog();
        }


      })


  }

  processCatalog() {
    this.categoryService.getCategoriesWithTypes()
      .subscribe(data => {
          this.categoriesWithTypes.set(data);

          this.activatedRoute.queryParams
            .pipe(
              debounceTime(500) // задержка запроса на время набора данных абонентом
            )
            .subscribe(params => {
              this.activeParams = ActiveParamsUtil.processParams(params);
              this.appliedFilters = [];
              this.activeParams.types.forEach(url => {
                for (let i = 0; i < this.categoriesWithTypes().length; i++) {

                  const foundType = this.categoriesWithTypes()[i].types.find(type => type.url === url)
                  if (foundType) {
                    this.appliedFilters.push({
                      name: foundType.name,
                      urlParam: foundType.url
                    })
                  }
                }
              });

              if (this.activeParams.heightFrom) {
                this.appliedFilters.push({
                  name: 'Высота от ' + this.activeParams.heightFrom + ' см',
                  urlParam: 'heightFrom'
                })
              }
              if (this.activeParams.heightTo) {
                this.appliedFilters.push({
                  name: 'Высота до ' + this.activeParams.heightTo + ' см',
                  urlParam: 'heightTo'
                })
              }
              if (this.activeParams.diameterFrom) {
                this.appliedFilters.push({
                  name: 'Диаметр от ' + this.activeParams.diameterFrom + ' см',
                  urlParam: 'diameterFrom'
                })
              }
              if (this.activeParams.diameterTo) {
                this.appliedFilters.push({
                  name: 'Диаметр до ' + this.activeParams.diameterTo + ' см',
                  urlParam: 'diameterTo'
                })
              }

              this.productService.getProducts(this.activeParams)
                .subscribe(data => {
                  this.pages = [];
                  for (let i = 1; i <= data.pages; i++) {
                    this.pages.push(i);
                  }
                  this.products.set(data.items.map(product => {
                    product.countInCart = this.cartService.getProductQuantity(product.id);
                    if (this.productsInFavorite() && this.productsInFavorite()!.length > 0) {
                      const productIsInFavorite = this.productsInFavorite()?.find(item => item.id === product.id);
                      if (productIsInFavorite) {
                        product.isInFavorite = true;
                      }
                    }

                    return product;
                  }));

                  // if (this.productsInFavorite() && this.productsInFavorite()!.length > 0) {
                  //   this.products.set(this.products().map(product => {
                  //     const productIsInFavorite = this.productsInFavorite()?.find(item => item.id === product.id);
                  //     if (productIsInFavorite) {
                  //       product.isInFavorite = true;
                  //     }
                  //     return product;
                  //   }));

                })


            });
        }
      )
  }

  removeAppliedFilter(appliedFilter
                      :
                      AppliedFilterType
  ) {
    if (appliedFilter.urlParam === 'heightFrom' || appliedFilter.urlParam === 'heightTo' ||
      appliedFilter.urlParam === 'diameterFrom' || appliedFilter.urlParam === 'diameterTo') {
      delete this.activeParams[appliedFilter.urlParam];
    } else {
      this.activeParams.types = this.activeParams.types.filter(item => item !== appliedFilter.urlParam);
    }
    this.activeParams.page = 1;
    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams
    })
  }

  toggleSorting() {
    this.sortingOpen = !this.sortingOpen;
  }

  sort(value
       :
       string
  ) {
    this.activeParams.sort = value;

    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams
    })
  }

  openPage(page
           :
           number
  ) {
    this.activeParams.page = page;
    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams
    })
  }

  openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/catalog'], {
        queryParams: this.activeParams
      })
    }

  }

  openNextPage() {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
      this.router.navigate(['/catalog'], {
        queryParams: this.activeParams
      })
    }
  }
}
