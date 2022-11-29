import { Component, OnInit } from '@angular/core';
import { ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/aio.service';

@Component({
  selector: 'app-input-mobile-number',
  templateUrl: './input-mobile-number.component.html',
  styleUrls: [
    '../../all-in-one.component.css',
    './input-mobile-number.component.css',
  ],
})
export class InputMobileNumberComponent implements OnInit {
  mobileNumber = '';

  constructor(private aioService: AioService) {
    aioService.currentStep = ServiceStep.InputMobileNumber;
  }

  ngOnInit(): void {}

  next() {
    this.aioService.next();
  }

  recieveInputNumber(event: any) {
    this.handleInputNumber(event);
  }

  handleInputNumber(key: string) {
    if (key == '11') {
      this.mobileNumber = this.mobileNumber.substring(
        0,
        this.mobileNumber.length - 1
      );
    } else {
      if (this.mobileNumber.length >= 10) {
        return;
      } else {
        this.mobileNumber = this.mobileNumber + key;
        if (this.mobileNumber.length == 10) {
          console.log(this.isVietnamesePhoneNumber(this.mobileNumber));
        }
      }
    }
    console.log(key);
    console.log(this.mobileNumber);
  }

  isVietnamesePhoneNumber(number: string) {
    return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(number);
  }

  // formartNumber(){
  //   this.mobileNumber.
  // }
}
