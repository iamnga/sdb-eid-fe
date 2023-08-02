import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/all-in-one/aio.service';

@Component({
  selector: 'app-input-phone-number',
  templateUrl: './input-phone-number.component.html',
  styleUrls: ['./input-phone-number.component.css'],
})
export class InputPhoneNumberComponent implements OnInit {
  phoneNumber = '';
  errMsg = 'Số điện thoại không đúng định dạng. Vui lòng nhập lại';
  err = false;

  constructor(
    private aioSvc: AioService
  ) {
    this.aioSvc.isProcessing = false;
    aioSvc.currentStep = ServiceStep.InputPhoneNumber;
    if (this.aioSvc.customerInfo.mobileNo)
      aioSvc.next();
  }

  ngOnInit(): void { }

  next() {
    if (!this.isVietnamesePhoneNumber() || this.phoneNumber.replace(/\s/g, '').length < 10) {
      return;
    } else {
      this.aioSvc.customerInfo.mobileNo = this.phoneNumber.replace(/\s/g, '');
      this.aioSvc.next();
    }
  }

  recieveInputNumber(event: any) {
    this.handleInputNumber(event);
  }

  handleInputNumber(key: string) {
    this.phoneNumber = this.phoneNumber.replace(/\s/g, '');
    if (key == 'clear') {
      this.phoneNumber = this.phoneNumber.substring(
        0,
        this.phoneNumber.length - 1
      );
      this.err = false;
    }
    else if (key == 'reset') {
      this.phoneNumber = ''
    }
    else {
      if (this.phoneNumber.length >= 10) {
        this.phoneNumber = this.formatPhoneNumber(this.phoneNumber)
        return;
      } else {
        this.phoneNumber = this.phoneNumber + key;
        if (this.phoneNumber.length == 10) {
          this.err = !this.isVietnamesePhoneNumber();
        } else {
          this.err = false;
        }
      }
    }
    this.phoneNumber = this.formatPhoneNumber(this.phoneNumber)
    console.log(key);
    console.log(this.phoneNumber);
  }

  isVietnamesePhoneNumber() {
    return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(this.phoneNumber.replace(/\s/g, ''));
  }

  formatPhoneNumber(phoneNumber: string) {

    // Kiểm tra xem số điện thoại có ít nhất 4 chữ số không
    if (phoneNumber.length < 4) {
      // Nếu không đủ 4 chữ số, không thể định dạng, trả về số điện thoại ban đầu
      return phoneNumber;
    }

    // Chia số điện thoại thành các phần như: 0349 44
    const formattedPhoneNumber = `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4, 7)} ${phoneNumber.slice(7)}`;
    return formattedPhoneNumber;
  }
}
