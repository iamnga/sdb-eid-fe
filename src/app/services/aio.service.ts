import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import {
  AllInOneRequest,
  CheckCustomerRequestData,
  CustomerEnroll,
  RequestOtpRequestData,
  UpdateLogStepData,
  VerifyOtpRequestData,
} from '../models/aio';
import { CustomerInfo } from '../models/customer-info';
import { Service, ServiceStep } from '../models/enum';
import { UUID } from 'angular2-uuid';
import { Alert, Template } from '../models/alert';
import { AlertComponent } from '../all-in-one/shared/dialog/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AioService {
  currentSerice = Service.None;
  currentStep = ServiceStep.DashBoard;
  cusInfo: CustomerInfo = new CustomerInfo();
  isProcessing = false;
  apiUrl = environment.apiUrl;
  deviceID = '00000001';
  sessionID = 'd';
  refNumber = '';
  customerEnrollInfo: CustomerEnroll;

  headerDict = {
    'Content-Type': 'application/json;ngann',
    Accept: '*/*',
    'Access-Control-Allow-Origin': '*',
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
    public dialog: MatDialog
  ) {
    this.cusInfo = {
      name: 'TRAN MINH HOANG LONG',
      phone: '0979 327 455',
      gender: 'Nam',
      dob: '16/03/1995',
      idNo: '231053235256',
      dateOfIssuance: '06/05/2022',
      dateOfExpiry: '06/05/2040',
      residenceAddress: '268 Nam Kỳ Khởi Nghĩa, P.8, Q.3, TP.HCM',
      email: '',
      contactAddress: '',
      job: '',
    };
  }

  create() {
    this.isProcessing = true;
    // this.getSessionId();
  }

  release() {
    this.isProcessing = false;
    this.currentSerice = Service.None;
    this.currentStep = ServiceStep.DashBoard;
    this.refNumber = '';

    this.cusInfo = {
      name: 'TRAN MINH HOANG LONG',
      phone: '0979 327 455',
      gender: 'Nam',
      dob: '16/03/1995',
      idNo: '231053235256',
      dateOfIssuance: '06/05/2022',
      dateOfExpiry: '06/05/2040',
      residenceAddress: '268 Nam Kỳ Khởi Nghĩa, P.8, Q.3, TP.HCM',
      email: '',
      contactAddress: '',
      job: '',
    };

    this.router.navigate(['/aio/dash-board']);
  }

  // API

  getSessionId(): Observable<any> {
    let req = this.newRequest({ serviceCode: Service[this.currentSerice] });

    console.log(req);

    return this.http.post(this.apiUrl + 'get-sessionId', req, {
      headers: new HttpHeaders(this.headerDict),
    });
  }

  uploadFace(face: string) {
    let req = this.newRequest({ input: face });
    return this.http.post(this.apiUrl + 'upload-face', req, {
      headers: new HttpHeaders(this.headerDict),
    });
  }

  uploadFrontID(img: string) {
    let req = this.newRequest({ input: img });
    return this.http.post(this.apiUrl + 'upload-frontID', req, {
      headers: new HttpHeaders(this.headerDict),
    });
  }

  verifyEmail(email: string) {
    let req = this.newRequest({ email: email });
    return this.http.post(this.apiUrl + 'verify-email', req, {
      headers: new HttpHeaders(this.headerDict),
    });
  }

  checkAccount(accountNo: string) {
    let req = this.newRequest({
      accountNo: accountNo,
    });
    return this.http.post(this.apiUrl + 'check-account', req, {
      headers: new HttpHeaders(this.headerDict),
    });
  }

  checkCustomerByIdNo(customerID: string) {
    let req = this.newRequest({
      legalId: customerID,
      legalIdType: '1',
    });
    return this.http.post(this.apiUrl + 'check-customer', req, {
      headers: new HttpHeaders(this.headerDict),
    });
  }

  requestOtp(data: RequestOtpRequestData) {
    let req = this.newRequest(data);
    return this.http.post(this.apiUrl + 'request-otp', req, {
      headers: new HttpHeaders(this.headerDict),
    });
  }

  verifyOtp(data: VerifyOtpRequestData) {
    let req = this.newRequest(data);
    return this.http.post(this.apiUrl + 'verify-otp', req, {
      headers: new HttpHeaders(this.headerDict),
    });
  }

  customerEnroll(data: CustomerEnroll) {
    let req = this.newRequest(data);
    return this.http.post(this.apiUrl + 'create-customer', req, {
      headers: new HttpHeaders(this.headerDict),
    });
  }

  verifyAuthMethod(data: VerifyOtpRequestData) {
    let req = this.newRequest(data);
    return this.http.post(this.apiUrl + 'verify-authMethod', req, {
      headers: new HttpHeaders(this.headerDict),
    });
  }

  checkCustomer(data: CheckCustomerRequestData) {
    let req = this.newRequest(data);
    return this.http.post(this.apiUrl + 'check-customer', req, {
      headers: new HttpHeaders(this.headerDict),
    });
  }

  getProvinces(): Observable<any> {
    let req = this.newRequest();
    return this.http.post(this.apiUrl + 'provinces', req, {
      headers: new HttpHeaders(this.headerDict),
    });
  }

  getDistricts(proId: string): Observable<any> {
    let req = this.newRequest({ provinceID: proId });
    return this.http.post(this.apiUrl + 'districts', req, {
      headers: new HttpHeaders(this.headerDict),
    });
  }

  getWards(disId: string): Observable<any> {
    let req = this.newRequest({ districtID: disId });
    return this.http.post(this.apiUrl + 'wards', req, {
      headers: new HttpHeaders(this.headerDict),
    });
  }

  getOccupations(): Observable<any> {
    let req = this.newRequest();
    return this.http.post(this.apiUrl + 'occupations', req, {
      headers: new HttpHeaders(this.headerDict),
    });
  }

  alert(content: string) {
    let data = new Alert();

    data.template = Template.Simple;
    data.title = 'Thông báo';
    data.content = content;

    const dialogRef = this.dialog.open(AlertComponent, {
      data: data,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result: Alert) => {
      this.release();
    });
  }

  updateLogStep(
    identityID: string = '',
    lastRespCode: string = '',
    lastRespDescription: string = '',
    lastChildStep: string = ''
  ) {
    this.isProcessing = true;
    let data = new UpdateLogStepData();
    data.stepName = ServiceStep[this.currentStep];
    data.identityID = identityID;
    data.lastRespCode = lastRespCode;
    data.lastRespDescription = lastRespDescription;
    data.lastChildStep = lastChildStep;

    let req = this.newRequest(data);

    this.http
      .post(this.apiUrl + 'log-step', req, { headers: this.headerDict })
      .subscribe(
        (res: any) => {
          console.log(res);
          this.isProcessing = false;
          if (res) {
            if (res.respCode != '00') {
              this.alert(`Có lỗi xảy ra: updateLogStep`);
            }
          }
        },
        (err) => {
          this.isProcessing = false;
          this.alert(`Có lỗi xảy ra: updateLogStep`);
        }
      );
  }

  newRequest(data: any = null) {
    let req = new AllInOneRequest<typeof data>();

    req.refNumber = UUID.UUID();
    req.refDateTime = new Date().toISOString().replace('Z', '');
    req.deviceID = this.deviceID;
    req.sessionID = this.sessionID;
    req.data = data;

    return JSON.stringify(req);
  }

  next() {
    this.updateLogStep();
    if (!environment.production)
      //this.router.navigate(['/aio/on-boarding/account-and-alert']);
      this.router.navigate(['/aio/shared/verify-customer-info']);
    else {
      if (this.currentSerice == Service.OnBoarding) {
        switch (this.currentStep) {
          case ServiceStep.DashBoard: {
            this.router.navigate(['/aio/shared/capture-guide']);
            //this.router.navigate(['/aio/on-boarding/account-and-alert']);
            //this.router.navigate(['/aio/shared/verify-customer-info']);
            break;
          }
          case ServiceStep.CaptureGuide: {
            this.router.navigate(['/aio/shared/capture-face']);
            break;
          }
          case ServiceStep.CaptureFace: {
            this.router.navigate(['/aio/shared/input-finger']);
            break;
          }
          case ServiceStep.InputFinger: {
            this.router.navigate(['/aio/shared/collect-card-id']);
            break;
          }
          case ServiceStep.CollectCardId: {
            this.router.navigate(['/aio/shared/input-mobile-number']);
            break;
          }
          case ServiceStep.InputMobileNumber: {
            this.router.navigate(['/aio/shared/verify-customer-info']);
            break;
          }
          case ServiceStep.VerifyCustomerInfo: {
            this.router.navigate(['/aio/on-boarding/account-and-alert']);
            break;
          }
          case ServiceStep.AccountAndAlert: {
            this.router.navigate(['/aio/shared/verify-otp']);
            break;
          }
          case ServiceStep.VerifyOtp: {
            this.router.navigate(['/aio/on-boarding/end']);
            break;
          }
          case ServiceStep.End: {
            this.router.navigate(['/aio']);
            break;
          }
          default: {
            this.router.navigate(['/aio']);
            break;
          }
        }
      }
    }
  }
}

// {
//   name: 'TRAN MINH HOANG LONG',
//   phone: '0979 327 455',
//   gender: 'Nam',
//   dob: '16/03/1995',
//   idNo: '231053235256',
//   dateOfIssuance: '06/05/2022',
//   dateOfExpiry: '06/05/2040',
//   residenceAddress: '268 Nam Kỳ Khởi Nghĩa, P.8, Q.3, TP.HCM',
//   email: '',
//   contactAddress: '',
// };
