import { Component, OnInit } from '@angular/core';
import {
  AuthenInfo,
  GetAuthMethodRequestData,
  RequestOtpRequestData,
  VerifyOtpRequestData,
} from 'src/app/models/aio';
import { AuthType, Service, ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/aio.service';
import { AnimationOptions } from 'ngx-lottie';

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
  currentService: Service;
  service = Service;
  currentAuthType: AuthType;
  authType = AuthType;
  authenInfo: AuthenInfo[] = [];
  step = 1; //1: chọn authType - 2: verify
  faceLoad: AnimationOptions = {
    path: 'assets/all-in-one/shared/img/notifications.json',
  };

  constructor(public aioSvc: AioService) {
    aioSvc.currentStep = ServiceStep.VerifyOtp;
    this.currentStep = this.aioSvc.currentSerice == Service.OnBoarding ? 4 : 3;
    this.currentAuthType =
      this.aioSvc.currentSerice == Service.OnBoarding
        ? this.authType.SMSTTT
        : this.authType.None;
    this.currentService = this.aioSvc.currentSerice;
  }
  ngOnInit(): void {
    if (this.aioSvc.currentSerice == Service.OnBoarding) {
      this.requestOtp();
    } else if (this.aioSvc.currentSerice == Service.UpdateCardId) {
      this.getAuthMethod();
    }
  }

  selectAuthType(type: any) {
    this.currentAuthType = type;
    console.log(this.currentAuthType);
  }

  checkAuthType(type: any) {
    let result = false;
    if (this.authenInfo.length > 0)
      result =
        this.authenInfo.findIndex((x) => x.authType == type.toString()) > -1
          ? true
          : false;
    return result;
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
            if (res.data.authInfo) {
              this.authenInfo = res.data.authInfo;

              this.authenInfo = [
                { authType: this.authType.mCodeOTP, authDesVN: '' },
                { authType: this.authType.mConnect, authDesVN: '' },
              ];

              // if (this.authenInfo.length == 1) {
              //   this.currentAuthType = this.authenInfo[0].authType;
              //   this.requestOtp();
              // } else {
              //   this.currentAuthType = this.authType.None;
              // }
            } else this.aioSvc.alert(`Không tồn tại phương thức xác thực`);
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
    data.authType = this.currentAuthType;
    data.customerType = '1';
    data.mobileNo = this.aioSvc.customerInfo.mobileNo;
    data.channel = 'DigiZone';
    data.smsContent = 'NGANN';

    this.aioSvc.requestOtp(data).subscribe(
      (res: any) => {
        console.log('requestOtp', res);
        this.aioSvc.isProcessing = false;
        if (res.respCode) {
          this.step = 2;

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
    data.authType = this.currentAuthType.toString();
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
            // this.customerEnroll();
            this.aioSvc.next();
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
