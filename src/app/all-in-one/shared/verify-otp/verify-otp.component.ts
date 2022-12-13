import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { endianness } from 'os';
import {
  CustomerEnroll,
  OpenAccountRequestData,
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
  idEKYCPersonal = '';
  cifNo = '';

  constructor(private aioSvc: AioService, private elem: ElementRef) {
    aioSvc.currentStep = ServiceStep.VerifyOtp;
  }
  ngOnInit(): void {
    this.requestOtp();
  }

  requestOtp() {
    let data = new RequestOtpRequestData();
    data.customerID = this.aioSvc.customerInfo.customerID;
    data.cifNo = '1';
    data.authType = '3';
    data.customerType = '1';
    data.mobileNo = this.aioSvc.customerInfo.mobileNo;
    data.channel = 'DigiZone';
    data.smsContent = 'NGANN';

    this.aioSvc.isProcessing = true;
    this.aioSvc.requestOtp(data).subscribe(
      (res: any) => {
        console.log(res);
        if (res.respCode) {
          if (res.respCode != '00') {
            this.aioSvc.alert(`Có lỗi xảy ra requestOtp`);
            this.aioSvc.isProcessing = false;
          }
        } else {
          this.aioSvc.alert(`Có lỗi xảy ra requestOtp`);
          this.aioSvc.isProcessing = false;
        }
      },
      (err) => {
        this.aioSvc.alert(`Có lỗi xảy ra requestOtp`);
        this.aioSvc.isProcessing = false;
      }
    );
  }

  verifyOtp() {
    let data = new VerifyOtpRequestData();
    data.authCode = this.otp.join('');
    data.customerID = this.aioSvc.customerInfo.customerID;
    data.cifNo = '1';
    data.authType = '3';
    data.customerType = '1';
    data.mobileNo = this.aioSvc.customerInfo.mobileNo;
    data.serviceType = 'OA';
    this.aioSvc.isProcessing = true;
    this.aioSvc.verifyOtp(data).subscribe(
      (res: any) => {
        console.log(res);
        if (res.respCode) {
          if (res.respCode != '00') {
            this.aioSvc.alert(`Có lỗi xảy ra verifyOtp`);
            this.aioSvc.isProcessing = false;
          } else {
            this.customerEnroll();
          }
        } else {
          this.aioSvc.alert(`Có lỗi xảy ra verifyOtp`);
          this.aioSvc.isProcessing = false;
        }
      },
      (err) => {
        this.aioSvc.alert(`Có lỗi xảy ra verifyOtp`);
        this.aioSvc.isProcessing = false;
      }
    );
  }

  customerEnroll() {
    this.aioSvc.customerEnrollInfo.customerInfo = this.aioSvc.customerInfo;
    this.aioSvc.customerEnrollInfo.registerAlert = this.aioSvc.registerAlert;
    this.formatCustomerInfoData();
    console.log(this.aioSvc.customerEnrollInfo);
    this.aioSvc.customerEnroll().subscribe(
      (res: any) => {
        console.log(res);
        if (res.respCode == '00') {
          this.idEKYCPersonal = res.data.idEKYCPersonal;
          this.cifNo = res.data.cifNo;
          this.openAccount();
        } else {
          this.aioSvc.alert(`Có lỗi xảy ra customerEnroll`);
          this.aioSvc.isProcessing = false;
        }
      },
      (err) => {
        console.log(err);
        this.aioSvc.alert(`Có lỗi xảy ra customerEnroll`);
        this.aioSvc.isProcessing = false;
      }
    );
  }

  formatCustomerInfoData() {
    this.aioSvc.customerEnrollInfo.customerInfo.gender =
      this.aioSvc.customerEnrollInfo.customerInfo.gender.toLocaleLowerCase() ==
      'nam'
        ? 'M'
        : 'F';
    this.aioSvc.customerEnrollInfo.customerInfo.dob = this.formatDate(
      this.aioSvc.customerEnrollInfo.customerInfo.dob
    );

    this.aioSvc.customerEnrollInfo.customerInfo.issueDate = this.formatDate(
      this.aioSvc.customerEnrollInfo.customerInfo.issueDate
    );

    this.aioSvc.customerEnrollInfo.customerInfo.expireDate = this.formatDate(
      this.aioSvc.customerEnrollInfo.customerInfo.expireDate
    );

    this.aioSvc.customerEnrollInfo.customerInfo.country = 'VN';
    this.aioSvc.customerEnrollInfo.customerInfo.customerType = '1';
    this.aioSvc.customerEnrollInfo.customerInfo.categoryCustomer = 'N';
    this.aioSvc.customerEnrollInfo.customerInfo.issuePlace = 'CTCCSQLHCVTTXH';
    //TODO
    this.aioSvc.customerEnrollInfo.customerInfo.issueDate = '20200101';
  }

  formatDate(dob: string) {
    let arr = dob.split('/');
    return arr[2] + arr[1] + arr[0];
  }

  openAccount() {
    let data = new OpenAccountRequestData();
    data.registerAlert = this.aioSvc.customerEnrollInfo.registerAlert;
    data.fullName = this.aioSvc.customerEnrollInfo.customerInfo.fullName;
    data.mobileNo =
      '84' + this.aioSvc.customerEnrollInfo.customerInfo.mobileNo.substr(-9);
    data.accountCurrency = this.aioSvc.customerEnrollInfo.accountCurrency;
    data.accountType = this.aioSvc.customerEnrollInfo.accountType;
    data.branchCode = this.aioSvc.customerEnrollInfo.branchCode;
    data.cifNo = this.cifNo;
    data.idEKYCPersonal = this.idEKYCPersonal;
    data.prefixNumberAccount =
      this.aioSvc.customerEnrollInfo.prefixNumberAccount;

    this.aioSvc.openAccount(data).subscribe(
      (res: any) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
        this.aioSvc.alert(`Có lỗi xảy ra openAccount`);
        this.aioSvc.isProcessing = false;
      }
    );
  }

  confirm() {
    this.verifyOtp();
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
