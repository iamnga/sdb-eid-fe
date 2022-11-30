import { Component, OnInit } from '@angular/core';
import { ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/aio.service';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.css'],
})
export class VerifyOtpComponent implements OnInit {
  otp: Array<string> = [];

  arrOtp = [...Array(6).keys()];

  constructor(private aioSvc: AioService) {
    aioSvc.currentStep = ServiceStep.VerifyOtp;
  }
  ngOnInit(): void {}

  confirm() {
    this.aioSvc.next();
  }

  recieveInputNumber(event: any) {
    this.handleInputNumber(event);
  }

  handleInputNumber(key: string) {
    console.log(key);
    if (key == '11') {
      this.otp.splice(-1);
      console.log(this.otp);
    } else {
      if (this.otp.length >= 6) {
        return;
      } else {
        this.otp.push(key);
        console.log(this.otp);
      }
    }
  }

  showOtp(index: any) {
    return this.otp[index] ? this.otp[index] : '';
  }
}
