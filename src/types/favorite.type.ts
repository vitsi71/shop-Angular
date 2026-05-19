export interface FavoriteType {
  id:string,
  name:string,
  url:string,
  image: string,
  price: number
}

export interface FavoriteInCartType extends FavoriteType {
  countInCart: number
}
