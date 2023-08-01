import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-input-mobile-number',
  templateUrl: './input-mobile-number.component.html',
  styleUrls: ['./input-mobile-number.component.css'],
})
export class InputMobileNumberComponent implements OnInit {
  mobileNumber = '';
  errMsg = 'Số điện thoại không hợp lệ';
  err = false;

  constructor(
    public dialogRef: MatDialogRef<InputMobileNumberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {
    this.mobileNumber = data;
  }

  ngOnInit(): void {}

  next() {
    if (!this.isVietnamesePhoneNumber() || this.mobileNumber.length < 10) {
      return;
    } else {
      this.dialogRef.close(this.mobileNumber);
    }
  }

  recieveInputNumber(event: any) {
    this.handleInputNumber(event);
  }

  handleInputNumber(key: string) {
    if (key == 'c') {
      this.mobileNumber = this.mobileNumber.substring(
        0,
        this.mobileNumber.length - 1
      );
      this.err = false;
    } else {
      if (this.mobileNumber.length >= 10) {
        return;
      } else {
        this.mobileNumber = this.mobileNumber + key;
        if (this.mobileNumber.length == 10) {
          this.err = !this.isVietnamesePhoneNumber();
        } else {
          this.err = false;
        }
      }
    }
    console.log(key);
    console.log(this.mobileNumber);
  }

  isVietnamesePhoneNumber() {
    return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(this.mobileNumber);
  }
}
