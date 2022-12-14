import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import {
  AllInOneRequest,
  AuthenInfo,
  CheckCustomerByIdNoResponseData,
  CheckCustomerRequestData,
  CheckCustomerSDBRequestData,
  CustomerEnroll,
  CustomerInfo,
  GetAuthMethodRequestData,
  OpenAccountRequestData,
  OpenAccountResponseData,
  RegisterAlert,
  RequestOtpRequestData,
  UpdateCustomerRequestData,
  UpdateLogStepData,
  VerifyOtpRequestData,
} from '../../models/aio';
import { Service, ServiceStep } from '../../models/enum';
import { UUID } from 'angular2-uuid';
import { Alert, Template } from '../../models/alert';
import { AlertComponent } from '../../all-in-one/shared/dialog/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { FingerResponse } from '../../models/mk';
import Utils from '../../all-in-one/shared/utils/utils';
import { mergeMap, flatMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AioService {
  currentSerice = Service.None;
  currentStep = ServiceStep.DashBoard;
  isProcessing = false;
  apiUrl = environment.apiUrl;
  deviceID = environment.production ? '00000001' : '00000002';
  sessionID = '';
  refNumber = '';
  customerEnrollInfo = new CustomerEnroll();
  customerInfo = new CustomerInfo();
  registerAlert = new RegisterAlert();
  fpResponse = new FingerResponse();
  openAccountResponseData = new OpenAccountResponseData();
  checkCustomerByIdNoResponseData = new CheckCustomerByIdNoResponseData();
  fpAttemp = 0;
  faceCaptured = '';
  frontCardId = '';
  backCardId = '';
  authenInfo: AuthenInfo[] = [];

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
    this.openAccountResponseData = new OpenAccountResponseData();
    this.checkCustomerByIdNoResponseData =
      new CheckCustomerByIdNoResponseData();
    this.frontCardId = '';
    this.backCardId = '';
    this.faceCaptured = '';
    this.fpAttemp = 0;
    this.authenInfo = [];
    this.router.navigate(['/aio/dash-board']);
  }

  // API

  postAsync(route: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${route}`, data, {
      headers: new HttpHeaders(this.headerDict),
    });
  }

  getTestCase() {
    return this.http.get(
      'https://script.googleusercontent.com/macros/echo?user_content_key=51ggE-tGOfKm5pHh-TI9ya8gF0L7FZtI_78goLzKEOb7RSEpFmAFtCP1w6EGFUbggpGcPXMmXOerPw68OpBR01KlJ-PMbKNim5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnLcmh-ftdXUoLC-snEeYhvYipzZ81i4aAU7lEl4TR6BinQ38WpmQm1TXteMJsW-0eIZp7UDGMETJPFCn-R5LuM_0bsUVe31J1A&lib=Ms7HLW8aIvZno15AlAhQeXu7_LOrhYMhx',
      {
        headers: new HttpHeaders(this.headerDict),
      }
    );
  }

  getSessionId(): Observable<any> {
    let req = this.newRequest({ serviceCode: Service[this.currentSerice] });

    console.log(req);

    return this.http.post(this.apiUrl + 'get-sessionId', req, {
      headers: new HttpHeaders(this.headerDict),
    });
  }

  testRSA(): Observable<any> {
    let req = this.newRequest({ serviceCode: Service[this.currentSerice] });
    console.log(req);

    req = `{"refNumber":"f74ec3ae-a3a6-264c-7e06-6c0cf21a9803","refDateTime":"2022-12-30T09:19:11.237","deviceID":"00000002","sessionID":"","data":{"serviceCode":"None"}}`;
    Utils.sign2(req);
    console.log('sign');
    console.log(Utils.sign3(req));
    console.log('payload');
    console.log(Utils.encrypt(req));

    // return this.http.post(
    //   this.apiUrl + 'test-rsa',
    //   Utils.encrypt(req).toString(),
    //   {
    //     headers: new HttpHeaders({
    //       'Content-Type': 'application/json;',
    //       Accept: '*/*',
    //       'Access-Control-Allow-Origin': '*',
    //       sign: Utils.sign3(req).toString(),
    //     }),
    //   }
    // );

    return Utils.sign(req).pipe(
      mergeMap((signed) => {
        console.log(signed);

        return this.http.post(
          this.apiUrl + 'test-rsa',
          btoa(Utils.encrypt(req).toString()),
          {
            headers: new HttpHeaders({
              'Content-Type': 'application/json;',
              Accept: '*/*',
              'Access-Control-Allow-Origin': '*',
              sign: btoa(signed),
            }),
          }
        );
      })
    );
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
    let req = this.newRequest(null, this.deviceID, this.sessionID, false);
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

  checkCustomerSDB(data: CheckCustomerSDBRequestData) {
    let req = this.newRequest(data);
    return this.http.post(this.apiUrl + 'check-customer-sdb', req, {
      headers: new HttpHeaders(this.headerDict),
    });
  }

  updateCustomer(data: UpdateCustomerRequestData) {
    let req = this.newRequest(data);
    return this.http.post(this.apiUrl + 'update-customer', req, {
      headers: new HttpHeaders(this.headerDict),
    });
  }

  getAuthMethod(data: GetAuthMethodRequestData) {
    let req = this.newRequest(data);
    return this.http.post(this.apiUrl + 'get-authMethod', req, {
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
    data.title = 'Th??ng b??o';
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
    lastChildStep: string = '',
    isNext: boolean = true
  ) {
    let data = new UpdateLogStepData();
    data.stepName = ServiceStep[this.currentStep];
    data.identityID = identityID;
    data.lastRespCode = lastRespCode == '' ? '00' : lastRespCode;
    data.lastRespDescription =
      lastRespDescription == '' ? 'Success' : lastRespDescription;
    data.lastChildStep = lastChildStep ? lastChildStep : data.stepName;

    let req = this.newRequest(data);

    this.http
      .post(this.apiUrl + 'log-step', req, { headers: this.headerDict })
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res) {
            if (res.respCode != '00') {
              this.isProcessing = false;
              this.alert(`C?? l???i x???y ra: updateLogStep`);
            } else {
              this.isProcessing = false;
              if (isNext) {
                this.navigate();
              } else {
                this.release();
              }
            }
          }
        },
        (err) => {
          this.isProcessing = false;
          this.alert(`C?? l???i x???y ra: updateLogStep`);
        }
      );
  }

  navigate() {
    if (this.currentSerice == Service.OnBoarding) {
      switch (this.currentStep) {
        case ServiceStep.DashBoard: {
          if (environment.production) {
            this.router.navigate(['/aio/shared/capture-guide']);
          } else {
            // this.router.navigate(['/aio/shared/verify-customer-info']);
            this.router.navigate(['/aio/shared/capture-guide']);
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
          this.router.navigate(['/aio/on-boarding']);
          break;
        }
        case ServiceStep.CustomerEnroll: {
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
            //this.router.navigate(['/aio/shared/verify-otp']);
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
          //this.router.navigate(['/aio/update-card-id']);
          break;
        }
        case ServiceStep.VerifyOtp: {
          this.router.navigate(['/aio/update-card-id']);
          break;
        }
        case ServiceStep.UpdateCustomerInfo: {
          this.router.navigate(['/aio/update-card-id/update-success']);
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

  newRequest(
    data: any = null,
    deviceID: string = this.deviceID,
    sessionID: string = this.sessionID,
    isProcessing: boolean = true
  ) {
    this.isProcessing = isProcessing;
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
  }

  fakeData() {
    this.getTestCase().subscribe((res: any) => {
      console.log(res);
      let data = res.content[1];
      console.log('fake data', data);
      let customerInfo = new CustomerInfo();
      customerInfo.fullName = data[1];
      customerInfo.customerID = data[2];
      customerInfo.customerIDOld = data[3];
      customerInfo.gender = data[4];
      customerInfo.dob = data[5];
      customerInfo.mobileNo = data[6];
      customerInfo.nationality = data[7];
      customerInfo.towncountry = data[8];
      customerInfo.expireDate = data[9];
      customerInfo.issueDate = data[10];
      customerInfo.address = data[11];

      let auths = data[12].split(',');

      for (let i = 0; i < auths.length; i++) {
        let auth = new AuthenInfo();
        auth.authType = auths[i];
        auth.authDesVN = '';
        this.authenInfo.push(auth);
      }

      this.customerInfo = customerInfo;
      this.next();
    });
  }
}
