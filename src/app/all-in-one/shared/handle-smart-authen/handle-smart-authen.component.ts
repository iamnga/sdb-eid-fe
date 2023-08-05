import { Component } from '@angular/core';
import {
  AuthenInfo,
  GetAuthMethodRequestData
} from 'src/app/models/aio';
import { AuthType, Service, ServiceStep } from 'src/app/models/enum';
import { AnimationOptions } from 'ngx-lottie';
import { AioService } from 'src/app/services/all-in-one/aio.service';

@Component({
  selector: 'app-handle-smart-authen',
  templateUrl: './handle-smart-authen.component.html',
  styleUrls: ['./handle-smart-authen.component.css', '../../all-in-one.component.css'],
})
export class HandleSmartAuthenComponent {
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
    aioSvc.currentStep = ServiceStep.HandleSmartAuthen;
    this.currentStep = this.aioSvc.currentSerice == Service.OnBoarding ? 4 : 3;
    this.currentService = this.aioSvc.currentSerice;
    if (aioSvc.currentAuthType != AuthType.None) {
      aioSvc.next();
    } else {
      this.authenInfo = aioSvc.authenInfo;
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
  next() {
    this.aioSvc.currentAuthType = this.currentAuthType;
    this.aioSvc.next();
  }

}
