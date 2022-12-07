import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { endianness } from 'os';
import {
  CustomerEnroll,
  RequestOtpRequestData,
  VerifyOtpRequestData,
} from 'src/app/models/aio';
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

  constructor(private aioSvc: AioService, private elem: ElementRef) {
    aioSvc.currentStep = ServiceStep.VerifyOtp;
  }
  ngOnInit(): void {
    this.requestOtp();
  }

  requestOtp() {
    let data = new RequestOtpRequestData();
    data.customerID = '352229667';
    data.cifNo = '1';
    data.authType = '3';
    data.customerType = '1';
    data.mobileNo = '0349444440';
    data.channel = 'DigiZone';
    data.smsContent = 'NGANN';

    this.aioSvc.requestOtp(data).subscribe(
      (res: any) => {
        console.log(res);
        if (res.respCode) {
          if (res.respCode != '00') {
            this.aioSvc.alert(`Có lỗi xảy ra requestOtp`);
          }
        } else {
          this.aioSvc.alert(`Có lỗi xảy ra requestOtp`);
        }
      },
      (err) => {
        this.aioSvc.alert(`Có lỗi xảy ra requestOtp`);
      }
    );
  }

  verifyOtp() {
    let data = new VerifyOtpRequestData();
    data.authCode = this.otp.join('');
    data.customerID = '352229667';
    data.cifNo = '1';
    data.authType = '3';
    data.customerType = '1';
    data.mobileNo = '0349444440';
    data.serviceType = 'OA';

    this.aioSvc.verifyOtp(data).subscribe(
      (res: any) => {
        console.log(res);
        if (res.respCode) {
          if (res.respCode != '00') {
            this.aioSvc.alert(`Có lỗi xảy ra verifyOtp`);
          } else {
          }
        } else {
          this.aioSvc.alert(`Có lỗi xảy ra verifyOtp`);
        }
      },
      (err) => {
        this.aioSvc.alert(`Có lỗi xảy ra verifyOtp`);
      }
    );
  }

  customerEnroll() {
    let data = new CustomerEnroll();
  }

  getOtp() {}

  confirm() {
    this.aioSvc.next();
  }

  recieveInputNumber(event: any) {
    this.handleInputNumber(event);
  }

  handleInputNumber(key: string) {
    console.log(key);
    if (key == 'c') {
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
