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
  selector: 'app-inquiry-authen',
  templateUrl: './inquiry-authen.component.html',
  styleUrls: ['./inquiry-authen.component.css', '../../all-in-one.component.css'],
})
export class InquiryAuthenComponent implements OnInit {
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

  constructor(public aioSvc: AioService) {
    aioSvc.currentStep = ServiceStep.InquiryAuthen;
    this.currentStep = this.aioSvc.currentSerice == Service.OnBoarding ? 4 : 3;
    // this.currentAuthType =
    //   this.aioSvc.currentSerice == Service.OnBoarding
    //     ? this.authType.SMSTTT
    //     : this.authType.None;
    this.currentService = this.aioSvc.currentSerice;
  }
  ngOnInit(): void {
    this.authenInfo = [{
      authType: AuthType.mCodeOTP,
      authDesVN: ''
    }, {
      authType: AuthType.mConnect,
      authDesVN: ''
    }]
    // this.getAuthMethod();
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
            this.aioSvc.alert(`Lỗi hệ thống`);
          } else {
            if (res.data.authInfo) {
              this.authenInfo = res.data.authInfo;
              if (this.authenInfo.length == 1) {
                this.currentAuthType = this.authenInfo[0].authType;
                this.next();
              } else {
                this.currentAuthType = this.authType.None;
              }
            } else this.aioSvc.alert(`Không tồn tại phương thức xác thực`);
          }
        } else {
          this.aioSvc.alert(`Lỗi hệ thống`);
        }
      },
      (err: any) => {
        this.aioSvc.alert(`Lỗi hệ thống`);
        this.aioSvc.isProcessing = false;
      }
    );
  }

  next() {
    this.aioSvc.currentAuthType = this.currentAuthType;
    this.aioSvc.next();
  }

}
