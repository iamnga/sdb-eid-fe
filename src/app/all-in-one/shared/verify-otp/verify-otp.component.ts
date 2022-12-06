import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import {
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

  constructor(private aioSvc: AioService) {
    aioSvc.currentStep = ServiceStep.VerifyOtp;
  }
  ngOnInit(): void {
    this.aioSvc.updateLogStep();
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
      (res) => {
        console.log(res);
      },
      (err) => {}
    );
  }

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
