import {Component, ElementRef, inject, OnInit, signal, TemplateRef, ViewChild, WritableSignal} from '@angular/core';
import {CartService} from '../../../shared/services/cart.service';
import {CartType} from '../../../../types/cart.type';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {DeliveryType} from '../../../../types/delivery.type';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PaymentType} from '../../../../types/payment.type';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {OrderService} from '../../../shared/services/order.service';
import {OrderType} from '../../../../types/order.type';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-order',
  standalone: false,
  templateUrl: './order.html',
  styleUrl: './order.scss',
})
export class Order implements OnInit {

  deliveryType: DeliveryType = DeliveryType.delivery;
  deliveryTypes: typeof DeliveryType = DeliveryType;
  cart: WritableSignal<CartType | null> = signal<CartType | null>(null);
  totalAmount: number = 0;
  totalCount: number = 0;
  protected readonly PaymentType: typeof PaymentType = PaymentType;
  private fb: FormBuilder = inject(FormBuilder);
  orderForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    fatherName: [''],
    phone: ['', Validators.required],
    paymentType: [PaymentType.cashToCourier, Validators.required],
    email: ['', [Validators.required, Validators.email]],
    street: [''],
    house: [''],
    entrance: [''],
    apartment: [''],
    comment: ['']
  });

  @ViewChild("popup") popup!: TemplateRef<ElementRef>;
  dialogRef: MatDialogRef<any> | null = null;

  constructor(private dialog: MatDialog, private _snackBar: MatSnackBar, private router: Router,
              private cartService: CartService, private orderService: OrderService) {
    this.updateDeliveryType();
  }


  ngOnInit() {
    this.cartService.getCart()
      .subscribe((dataCart: CartType | DefaultResponseType) => {
        if ((dataCart as DefaultResponseType).error !== undefined) {
          throw new Error((dataCart as DefaultResponseType).message);
        }
        this.cart.set(dataCart as CartType);
        if (!this.cart() || (this.cart()?.items.length === 0)) {
          this.router.navigate(['/']);
          this._snackBar.open("Корзина пустая");
          return;
        }
        this.calculateTotal();
      })
  }

  calculateTotal() {
    this.totalAmount = 0;
    this.totalCount = 0;
    if (this.cart()) {
      this.cart()?.items.forEach(item => {
          this.totalAmount += item.quantity * item.product.price;
          this.totalCount += item.quantity;
        }
      )
    }
  }

  changeDeliveryType(type: DeliveryType) {
    this.deliveryType = type;
    this.updateDeliveryType();
  }

  updateDeliveryType() {
    if (this.deliveryType === DeliveryType.delivery) {
      this.orderForm.get('street')?.setValidators(Validators.required);
      this.orderForm.get('house')?.setValidators(Validators.required);
    } else {
      this.orderForm.get('street')?.removeValidators(Validators.required);
      this.orderForm.get('house')?.removeValidators(Validators.required);
      this.orderForm.get('street')?.setValue('');
      this.orderForm.get('house')?.setValue('');
      this.orderForm.get('entrance')?.setValue('');
      this.orderForm.get('apartment')?.setValue('');
    }
    this.orderForm.get('street')?.updateValueAndValidity();
    this.orderForm.get('house')?.updateValueAndValidity();
  }

  createOrder() {
    if (this.orderForm.valid) {
      const paramsObject: OrderType = {
        deliveryType: this.deliveryType,
        firstName: this.orderForm.value.firstName,
        lastName: this.orderForm.value.lastName,
        phone: this.orderForm.value.phone,
        paymentType: this.orderForm.value.paymentType,
        email: this.orderForm.value.email
      };

      if (this.deliveryType === DeliveryType.delivery) {
        if (this.orderForm.value.street) {
          paramsObject.street = this.orderForm.value.street;
        }
        if (this.orderForm.value.house) {
          paramsObject.house = this.orderForm.value.house;
        }
        if (this.orderForm.value.entrance) {
          paramsObject.entrance = this.orderForm.value.entrance;
        }
        if (this.orderForm.value.apartment) {
          paramsObject.apartment = this.orderForm.value.apartment;
        }
      }
      if (this.orderForm.value.fatherName) {
        paramsObject.fatherName = this.orderForm.value.fatherName;
      }
      if (this.orderForm.value.comment) {
        paramsObject.comment = this.orderForm.value.comment;
      }

      this.orderService.createOrder(paramsObject)
        .subscribe({
          next: (data: OrderType | DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              throw new Error((data as DefaultResponseType).message);
            }
            this.dialogRef = this.dialog.open(this.popup);
            this.dialogRef.backdropClick()
              .subscribe(() => this.router.navigate(['']))
          },
          error: (errResponse: HttpErrorResponse) => {
            if (errResponse.error && errResponse.error.message) {
              this._snackBar.open(errResponse.error.message);
            } else {
              this._snackBar.open("Ошибка заказа");
            }
          }
        });

    }
  }

  closePopup() {
    this.dialogRef?.close();
    this.router.navigate(['']);
  }
}
