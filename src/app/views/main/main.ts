import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {ProductService} from '../../shared/services/product.service';
import {ProductType} from '../../../types/product.type';
import {OwlOptions} from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-main',
  standalone: false,
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main implements OnInit {

  products: WritableSignal<ProductType[]> = signal<ProductType[]>([]);

  // настройки для карусели продуктов
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 24, // настройка расстояния между слайдами за счет сдвига последнего слайда
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: false
  }
  // настройки для карусели отзывов
  customOptionsReviews: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 26, // настройка расстояния между слайдами за счет сдвига последнего слайда
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
    },
    nav: false
  }

  reviews = [
    {
      name: "Ирина",
      image: 'review1.png',
      text: 'В ассортименте я встретила все комнатные растения, которые меня интересовали. Цены - лучшие в городе. Доставка - очень быстрая и с заботой о растениях. '
    },
    {
      name: "Анастасия",
      image: 'review2.png',
      text: 'Спасибо огромное! Цветок арека невероятно красив - просто бомба! От него все в восторге! Спасибо за сервис - все удобно сделано, доставили быстро. И милая открыточка приятным бонусом.'
    },
    {
      name: "Илья",
      image: 'review3.png',
      text: 'Магазин супер! Второй раз заказываю курьером, доставлено в лучшем виде. Ваш ассортимент комнатных растений впечатляет! Спасибо вам за хорошую работу!'
    },
    {
      name: "Аделина",
      image: 'review4.png',
      text: 'Хочу поблагодарить всю команду за помощь в подборе подарка для моей мамы! Все просто в восторге от мини-сада! А самое главное, что за ним удобно ухаживать, ведь в комплекте мне дали целую инструкцию.'
    },
    {
      name: "Яника",
      image: 'review5.png',
      text: 'Спасибо большое за мою обновлённую коллекцию суккулентов! Сервис просто на 5+: быстро, удобно, недорого. Что ещё нужно клиенту для счастья?'
    },
    {
      name: "Марина",
      image: 'review6.png',
      text: 'Для меня всегда важным аспектом было наличие не только физического магазина, но и онлайн-маркета, ведь не всегда есть возможность прийти на место. Ещё нигде не встречала такого огромного ассортимента!'
    },
    {
      name: "Станислав",
      image: 'review7.png',
      text: 'Хочу поблагодарить консультанта Ирину за помощь в выборе цветка для моей жены. Я ещё никогда не видел такого трепетного отношения к весьма непростому клиенту, которому сложно угодить! Сервис – огонь!'
    }
  ]

  constructor(private productService: ProductService) {
  }

  ngOnInit() {

    this.productService.getBestProducts()
      .subscribe((data: ProductType[]) => {
        this.products.set(data);
      })

  }
}
