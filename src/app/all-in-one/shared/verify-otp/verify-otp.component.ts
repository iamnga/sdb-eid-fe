import { Component, OnInit } from '@angular/core';
import {
  AuthenInfo,
  GetAuthMethodRequestData,
  RequestOtpRequestData,
  VerifyOtpRequestData,
} from 'src/app/models/aio';
import { AuthType, Service, ServiceStep } from 'src/app/models/enum';
import { AnimationOptions } from 'ngx-lottie';
import { environment } from 'src/environments/environment';
import { AioService } from 'src/app/services/all-in-one/aio.service';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.css', '../../all-in-one.component.css'],
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
  step = 2; //1: chọn authType - 2: verify
  faceLoad: AnimationOptions = {
    path: 'assets/all-in-one/shared/img/notifications.json',
  };
  countDown = 5;
  countDownInterval: any;
  errMsg = 'OTP không hợp lệ, Quý khách vui lòng thử lại';
  err = true;

  constructor(public aioSvc: AioService) {
    aioSvc.currentStep = ServiceStep.RequestAuthen;
    this.currentStep = this.aioSvc.currentSerice == Service.OnBoarding ? 4 : 3;
    this.currentService = this.aioSvc.currentSerice;
    // this.currentAuthType = this.aioSvc.currentAuthType;
    this.currentAuthType = AuthType.mConnect;
  }
  ngOnInit(): void {
    // this.handleOTP();
    // this.getAuthMethod();
    // this.requestAuthen();
  }

  countDownOTP() {
    this.countDownInterval = setInterval(() => {
      this.countDown--;
      if (this.countDown == 0) {
        clearInterval(this.countDownInterval);
      }
    }, 1000);
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

  requestAuthen() {
    if (
      this.currentAuthType == this.authType.mConnect ||
      this.currentAuthType == this.authType.SmartOTP
    ) {
      this.verifyAuthen();
    } else {
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
              this.aioSvc.alert(`Lỗi hệ thống`);
            }
          } else {
            this.aioSvc.alert(`Lỗi hệ thống`);
          }
        },
        (err) => {
          this.aioSvc.alert(`Lỗi hệ thống`);
          this.aioSvc.isProcessing = false;
        }
      );
    }
  }

  verifyAuthen() {
    let data = new VerifyOtpRequestData();
    data.authCode = this.otp.join('');
    data.customerID = this.aioSvc.customerInfo.customerID;
    data.cifNo = '1';
    data.authType = this.currentAuthType;
    data.customerType = '1';
    data.mobileNo = this.aioSvc.customerInfo.mobileNo;
    data.serviceType = 'OA';
    this.aioSvc.verifyOtp(data).subscribe(
      (res: any) => {
        console.log('verifyOtp', res);
        this.aioSvc.isProcessing = false;

        if (res.respCode) {
          if (res.respCode != '00') {
            if (res.respCode === '55') {
              this.aioSvc.alert(
                `OTP không hợp lệ, Quý khách vui lòng thử lại`,
                false
              );
            }
            if (res.respCode === '75') {
              this.aioSvc.alert(`Đã vượt quá số lần nhập OTP cho phép`);
            }
            if (res.respCode === '36') {
              this.aioSvc.alert(`Phương thức xác thực bị hạn chế`);
            }
            if (res.respCode === '68') {
              this.aioSvc.alert(`Quá thời gian nhập OTP`);
            }
            if (res.respCode === '06') {
              this.aioSvc.alert(`Lỗi hệ thống`);
            }
          } else {
            this.aioSvc.next();
          }
        } else {
          this.aioSvc.alert(`Lỗi hệ thống`);
        }
      },
      (err) => {
        this.aioSvc.alert(`Lỗi hệ thống`);
        this.aioSvc.isProcessing = false;
      }
    );
  }

  confirm() {
    this.verifyAuthen();
  }

  recieveInputNumber(event: any) {
    this.handleInputNumber(event);
  }

  handleInputNumber(key: string) {
    console.log(key);
    if (key == 'clear') {
      this.otp.splice(-1);
      console.log(this.otp);
    } else if (key == 'reset') {
      this.otp = [];
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
