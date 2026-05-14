import {Component, inject, OnInit} from '@angular/core';
import {PaymentType} from '../../../../types/payment.type';
import {DeliveryType} from '../../../../types/delivery.type';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../shared/services/user.service';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {UserInfoType} from '../../../../types/userInfo.type';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-info',
  standalone: false,
  templateUrl: './info.html',
  styleUrl: './info.scss',
})
export class Info implements OnInit {
  deliveryType: DeliveryType = DeliveryType.delivery;  // первый вариант
  deliveryTypes: typeof DeliveryType = DeliveryType;
  protected readonly PaymentType = PaymentType;
  private fb: FormBuilder = inject(FormBuilder);
  userInfoForm: FormGroup = this.fb.group({
    firstName: [''],
    lastName: [''],
    fatherName: [''],
    phone: [''],
    paymentType: [PaymentType.cashToCourier],
    //deliveryType: [DeliveryType.delivery],  // второй вариант изменения
    email: ['', Validators.required],
    street: [''],
    house: [''],
    entrance: [''],
    apartment: ['']
  });

  constructor(private _snackBar: MatSnackBar, private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getUserInfo()
      .subscribe((data: DefaultResponseType | UserInfoType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        const userInfo: UserInfoType = data as UserInfoType;
        const paramsToUpdate = {
          firstName: userInfo.firstName ? userInfo.firstName : '',
          lastName: userInfo.lastName ? userInfo.lastName : '',
          fatherName: userInfo.fatherName ? userInfo.fatherName : '',
          phone: userInfo.phone ? userInfo.phone : '',
          paymentType: userInfo.paymentType ? userInfo.paymentType : PaymentType.cashToCourier,
          email: userInfo.email ? userInfo.email : '',
          street: userInfo.street ? userInfo.street : '',
          house: userInfo.house ? userInfo.house : '',
          entrance: userInfo.entrance ? userInfo.entrance : '',
          apartment: userInfo.apartment ? userInfo.apartment : '',
        };
        this.userInfoForm.setValue(paramsToUpdate);
        if (userInfo.deliveryType) {
          this.deliveryType = userInfo.deliveryType;
        }
      });
  }

  changeDeliveryType(type: DeliveryType) {
    this.deliveryType = type; // первый вариант
    // this.userInfoForm.get('deliveryType')?.setValue(type); // второй вариант изменения
    this.userInfoForm.markAsDirty();
  }

  updateUserInfo() {
    if (this.userInfoForm.valid) {

      const paramObject: UserInfoType = {
        // firstName: [''],
        // lastName: [''],
        // fatherName: [''],
        // phone: [''],
        paymentType: this.userInfoForm.value.paymentType,
        deliveryType: this.deliveryType,
        email: this.userInfoForm.value.email,
        // street: [''],
        // house: [''],
        // entrance: [''],
        // apartment: ['']
      }
      if (this.userInfoForm.value.firstName) {
        paramObject.firstName = this.userInfoForm.value.firstName;
      }
      if (this.userInfoForm.value.lastName) {
        paramObject.lastName = this.userInfoForm.value.lastName;
      }
      if (this.userInfoForm.value.fatherName) {
        paramObject.fatherName = this.userInfoForm.value.fatherName;
      }
      if (this.userInfoForm.value.phone) {
        paramObject.phone = this.userInfoForm.value.phone;
      }
      if (this.userInfoForm.value.street) {
        paramObject.street = this.userInfoForm.value.street;
      }
      if (this.userInfoForm.value.house) {
        paramObject.house = this.userInfoForm.value.house;
      }
      if (this.userInfoForm.value.entrance) {
        paramObject.entrance = this.userInfoForm.value.entrance;
      }
      if (this.userInfoForm.value.apartment) {
        paramObject.apartment = this.userInfoForm.value.apartment;
      }

      this.userService.updateUserInfo(paramObject)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if (data.error) {
              this._snackBar.open(data.message);
              throw new Error(data.message);
            }
            this._snackBar.open(data.message);
            this.userInfoForm.markAsPristine(); // обратное сосотояние от dirty кнопка сохранить станет не активной
          },
          error: (errResponse: HttpErrorResponse) => {
            if (errResponse.error && errResponse.error.message) {
              this._snackBar.open(errResponse.error.message);
            } else {
              this._snackBar.open("Ошибка сохранения");
            }
          }
        })
    }

  }
}
