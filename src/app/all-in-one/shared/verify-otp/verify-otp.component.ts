import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { endianness } from 'os';
import {
  CustomerEnroll,
  GetAuthMethodRequestData,
  OpenAccountRequestData,
  RequestOtpRequestData,
  VerifyOtpRequestData,
} from 'src/app/models/aio';
import { Service, ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/aio.service';
import Utils from '../utils/utils';

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
  currentStep: ServiceStep;

  constructor(private aioSvc: AioService, private elem: ElementRef) {
    aioSvc.currentStep = ServiceStep.VerifyOtp;
    this.currentStep = this.aioSvc.currentSerice == Service.OnBoarding ? 4 : 3;
  }
  ngOnInit(): void {
    if (this.aioSvc.currentSerice == Service.OnBoarding) {
      this.requestOtp();
    } else if (this.aioSvc.currentSerice == Service.UpdateCardId) {
      this.getAuthMethod();
    }
  }

  getAuthMethod() {
    let data = new GetAuthMethodRequestData();
    data.cifNo = this.aioSvc.checkCustomerByIdNoResponseData.cifNo;
    data.customerID = this.aioSvc.checkCustomerByIdNoResponseData.legalId;
    data.customerType = '1';
    data.mobileNo = this.aioSvc.checkCustomerByIdNoResponseData.mobileNumber;
    this.aioSvc.getAuthMethod(data).subscribe(
      (res: any) => {
        console.log(res);
        this.aioSvc.isProcessing = false;

        if (res.respCode) {
          if (res.respCode != '00') {
            this.aioSvc.alert(`Có lỗi xảy ra getAuthMethod`);
          } else {
            // Do
          }
        } else {
          this.aioSvc.alert(`Có lỗi xảy ra getAuthMethod`);
        }
      },
      (err) => {
        this.aioSvc.alert(`Có lỗi xảy ra getAuthMethod`);
        this.aioSvc.isProcessing = false;
      }
    );
  }

  requestOtp() {
    //TODO: hard code
    let data = new RequestOtpRequestData();
    data.customerID = this.aioSvc.customerInfo.customerID;
    data.cifNo = '1';
    data.authType = '5';
    data.customerType = '1';
    data.mobileNo = this.aioSvc.customerInfo.mobileNo;
    data.channel = 'DigiZone';
    data.smsContent = 'NGANN';

    this.aioSvc.requestOtp(data).subscribe(
      (res: any) => {
        console.log('requestOtp', res);
        this.aioSvc.isProcessing = false;
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
        this.aioSvc.isProcessing = false;
      }
    );
  }

  verifyOtp() {
    let data = new VerifyOtpRequestData();
    data.authCode = this.otp.join('');
    data.customerID = this.aioSvc.customerInfo.customerID;
    data.cifNo = '1';
    data.authType = '5';
    data.customerType = '1';
    data.mobileNo = this.aioSvc.customerInfo.mobileNo;
    data.serviceType = 'OA';
    this.aioSvc.verifyOtp(data).subscribe(
      (res: any) => {
        console.log('verifyOtp', res);
        this.aioSvc.isProcessing = false;

        if (res.respCode) {
          if (res.respCode != '00') {
            this.aioSvc.alert(`Có lỗi xảy ra verifyOtp`);
          } else {
            this.customerEnroll();
          }
        } else {
          this.aioSvc.alert(`Có lỗi xảy ra verifyOtp`);
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
        this.aioSvc.isProcessing = false;

        console.log('customerEnroll', res);
        if (res.respCode == '00') {
          this.idEKYCPersonal = res.data.idEKYCPersonal;
          this.cifNo = res.data.cifNo;
          this.openAccount();
        } else {
          this.aioSvc.alert(`Có lỗi xảy ra customerEnroll`);
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
    this.aioSvc.customerEnrollInfo.customerInfo.dob = Utils.formatDate(
      this.aioSvc.customerEnrollInfo.customerInfo.dob
    );

    this.aioSvc.customerEnrollInfo.customerInfo.issueDate = Utils.formatDate(
      this.aioSvc.customerEnrollInfo.customerInfo.issueDate
    );

    this.aioSvc.customerEnrollInfo.customerInfo.expireDate = Utils.formatDate(
      this.aioSvc.customerEnrollInfo.customerInfo.expireDate
    );

    this.aioSvc.customerEnrollInfo.customerInfo.country = 'VN';
    this.aioSvc.customerEnrollInfo.customerInfo.customerType = '1';
    this.aioSvc.customerEnrollInfo.customerInfo.categoryCustomer = 'N';
    this.aioSvc.customerEnrollInfo.customerInfo.issuePlace = 'CTCCSQLHCVTTXH';
    //TODO
    this.aioSvc.customerEnrollInfo.customerInfo.issueDate = '20200101';
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
        this.aioSvc.isProcessing = false;
        if (res.respCode == '00') {
          this.aioSvc.openAccountResponseData = res.data;
          this.aioSvc.next();
        } else {
          this.aioSvc.alert(`Có lỗi xảy ra openAccount`);
        }
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
