import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import {
  AllInOneRequest,
  CheckCustomerRequestData,
  CustomerEnroll,
  CustomerInfo,
  OpenAccountRequestData,
  RegisterAlert,
  RequestOtpRequestData,
  UpdateLogStepData,
  VerifyOtpRequestData,
} from '../models/aio';
import { Service, ServiceStep } from '../models/enum';
import { UUID } from 'angular2-uuid';
import { Alert, Template } from '../models/alert';
import { AlertComponent } from '../all-in-one/shared/dialog/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { FingerResponse } from '../models/mk';

@Injectable({
  providedIn: 'root',
})
export class AioService {
  currentSerice = Service.None;
  currentStep = ServiceStep.DashBoard;
  isProcessing = false;
  apiUrl = environment.apiUrl;
  deviceID = '00000001';
  sessionID = '';
  refNumber = '';
  customerEnrollInfo = new CustomerEnroll();
  customerInfo = new CustomerInfo();
  registerAlert = new RegisterAlert();
  fpResponse: FingerResponse = new FingerResponse();
  fpAttemp = 0;
  faceCaptured = '';

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
  ) {}

  release() {
    this.isProcessing = false;
    this.currentSerice = Service.None;
    this.currentStep = ServiceStep.DashBoard;
    this.refNumber = '';
    this.sessionID = '';
    this.customerEnrollInfo = new CustomerEnroll();
    this.customerInfo = new CustomerInfo();
    this.registerAlert = new RegisterAlert();
    this.fpResponse = new FingerResponse();

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

  verifySessionID(deviceID: string, sessionID: string) {
    let req = this.newRequest(null, deviceID, sessionID);

    console.log(req);

    return this.http.post(this.apiUrl + 'verify-sessionId', req, {
      headers: new HttpHeaders(this.headerDict),
    });
  }

  uploadImage(
    img: string,
    type: string,
    deviceID: string = this.deviceID,
    sessionID: string = this.sessionID
  ) {
    let req = this.newRequest(
      { imageBas64: img, imageType: type },
      deviceID,
      sessionID
    );
    return this.http.post(this.apiUrl + 'upload-image', req, {
      headers: new HttpHeaders(this.headerDict),
    });
  }

  loadImage() {
    let req = this.newRequest();
    return this.http.post(this.apiUrl + 'load-image', req, {
      headers: new HttpHeaders(this.headerDict),
    });
  }

  compareFace() {
    let req = this.newRequest();
    return this.http.post(this.apiUrl + 'compareFace', req, {
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

  customerEnroll() {
    let req = this.newRequest(this.customerEnrollInfo);
    return this.http.post(this.apiUrl + 'create-customer', req, {
      headers: new HttpHeaders(this.headerDict),
    });
  }

  openAccount(data: OpenAccountRequestData) {
    let req = this.newRequest(data);
    return this.http.post(this.apiUrl + 'create-account', req, {
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

  findAddressByText(addressText: string) {
    let req = this.newRequest({
      addressText: addressText,
    });
    return this.http.post(this.apiUrl + 'find-address-by-text', req, {
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
    data.lastRespCode = lastRespCode == '' ? '00' : lastRespCode;
    data.lastRespDescription =
      lastRespDescription == '' ? 'Success' : lastRespDescription;
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

  newRequest(
    data: any = null,
    deviceID: string = this.deviceID,
    sessionID: string = this.sessionID
  ) {
    let req = new AllInOneRequest<typeof data>();

    req.refNumber = UUID.UUID();
    req.refDateTime = new Date().toISOString().replace('Z', '');
    req.deviceID = deviceID;
    req.sessionID = sessionID;
    req.data = data;

    return JSON.stringify(req);
  }

  next() {
    this.updateLogStep();

    if (this.currentSerice == Service.OnBoarding) {
      switch (this.currentStep) {
        case ServiceStep.DashBoard: {
          if (!environment.production) {
            this.router.navigate(['/aio/shared/capture-guide']);
          } else {
            this.router.navigate(['/aio/shared/verify-customer-info']);
          }
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
          // this.router.navigate(['/aio/shared/input-mobile-number']);
          this.router.navigate(['/aio/shared/verify-customer-info']);
          break;
        }

        case ServiceStep.VerifyCustomerInfo: {
          this.router.navigate(['/aio/shared/fill-info']);
          break;
        }
        case ServiceStep.FillInfo: {
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
    if (this.currentSerice == Service.UpdateCardId) {
      switch (this.currentStep) {
        case ServiceStep.DashBoard: {
          if (environment.production) {
            this.router.navigate(['/aio/shared/capture-guide']);
          } else {
            this.router.navigate(['/aio/update-card-id/recheck-info']);
          }
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
          this.router.navigate(['/aio/update-card-id/recheck-info']);
          break;
        }

        case ServiceStep.RecheckInfo: {
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

  fakeData() {
    let customerInfo = new CustomerInfo();

    customerInfo.address =
      'Ấp Mũi Tràm C, Khánh Bình Tây Bắc, Trần Văn Thời, Cà Mau';
    customerInfo.dob = '25/01/1995';
    customerInfo.gender = 'Nam';
    customerInfo.customerID = '352229667';
    customerInfo.customerIDOld = '352229667';
    customerInfo.nationality = 'Việt Nam';
    customerInfo.towncountry = 'Khánh Bình Tây Bắc, Trần Văn Thời, Cà Mau';
    customerInfo.fullName = 'Bùi Hà Duy';
    customerInfo.expireDate = '12/11/2034';
    customerInfo.issueDate = '01/01/2021';
    customerInfo.mobileNo = '0933881676';

    this.customerInfo = customerInfo;
  }
}
