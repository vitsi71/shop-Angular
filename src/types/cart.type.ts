export type CartType ={
  items: {
      product: {
        id: string,
        name:string,
        url: string,
        price: number,
        image: string,
      },
      quantity: number
    } []
}
