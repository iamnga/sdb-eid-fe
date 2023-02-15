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
import { CryptoUtils } from 'src/app/all-in-one/shared/utils/cryptoUtils';
import * as jose from 'node-jose';
import TestCase from '../../../assets/testCase.json';
import { AuthType } from '../../models/enum';
import Utils from 'src/app/all-in-one/shared/utils/utils';

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
  testCaseURL = 'assets/testCase.json';
  headerDict = {
    'Content-Type': 'application/json;',
    Accept: '*/*',
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
      'https://script.googleusercontent.com/macros/echo?user_content_key=51ggE-tGOfKm5pHh-TI9ya8gF0L7FZtI_78goLzKEOb7RSEpFmAFtCP1w6EGFUbggpGcPXMmXOerPw68OpBR01KlJ-PMbKNim5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnLcmh-ftdXUoLC-snEeYhvYipzZ81i4aAU7lEl4TR6BinQ38WpmQm1TXteMJsW-0eIZp7UDGMETJPFCn-R5LuM_0bsUVe31J1A&lib=Ms7HLW8aIvZno15AlAhQeXu7_LOrhYMhx'
    );
  }

  getSessionId(): Observable<any> {
    let req = this.newRequest({ serviceCode: Service[this.currentSerice] });

    console.log(req);

    return this.http.post(this.apiUrl + 'get-sessionId', req, {
      headers: new HttpHeaders(this.headerDict),
    });
  }

  testHS() {
    let shared = CryptoUtils.randomKeyString(32);
    let sharedSecretBase64 = CryptoUtils.toBase64(shared);
    let jwk: any;
    let encryptedContent: any;
    let rsaKey: any;
    let keyFromServer: any;
    console.log(
      JSON.stringify({
        kty: 'oct',
        alg: 'dir',
        kid: shared,
        k: sharedSecretBase64,
        length: 256,
      })
    );

    jose.JWK.asKey(
      JSON.stringify({
        kty: 'oct',
        alg: 'dir',
        kid: shared,
        k: sharedSecretBase64,
        length: 256,
      }),
      'json'
    ).then((result) => {
      jwk = result;
      console.log('jwk', jwk);

      jose.JWK.asKey(environment.publicKey, 'pem').then((result) => {
        rsaKey = result;
        console.log('rsaKey', rsaKey);

        jose.JWE.createEncrypt({ format: 'compact' }, rsaKey)
          .update(jose.util.base64url.decode(sharedSecretBase64))
          .final()
          .then((result: any) => {
            encryptedContent = result;
            console.log('encryptedContent', encryptedContent);
            this.http
              .post(
                this.apiUrl + 'handshake',
                JSON.stringify({ key: encryptedContent }),
                {
                  headers: new HttpHeaders({
                    'Content-Type': 'application/json;',
                    Accept: '*/*',
                    'Access-Control-Allow-Origin': '*',
                  }),
                }
              )
              .subscribe((res: any) => {
                console.log('hsResp', res);
                keyFromServer = res.key;

                jose.JWE.createDecrypt(jwk)
                  .decrypt(res.challenge)
                  .then((res) => {
                    console.log('decrypt challenge', res.plaintext.toString());
                    if (res.plaintext.toString() == shared) {
                      jose.JWK.asKey(
                        JSON.stringify({
                          kty: 'oct',
                          alg: 'A256GCM',
                          kid: shared,
                          use: 'enc',
                          k: sharedSecretBase64,
                          length: 256,
                        }),
                        'json'
                      ).then((jwk2) => {
                        let req = this.newRequest({
                          serviceCode: Service[this.currentSerice],
                        });
                        let reqBase64 = CryptoUtils.toBase64(req);
                        console.log('jwk2', jwk2);
                        console.log('reqBase64', reqBase64);

                        jose.JWE.createEncrypt({ format: 'compact' }, jwk2)
                          .update(jose.util.base64url.decode(reqBase64))
                          .final()
                          .then((dataEnc: any) => {
                            console.log('dataEnc', dataEnc);

                            let deviceIdBase64 = CryptoUtils.toBase64(
                              this.deviceID
                            );
                            jose.JWE.createEncrypt(
                              { format: 'compact' },
                              rsaKey
                            )
                              .update(
                                jose.util.base64url.decode(deviceIdBase64)
                              )
                              .final()
                              .then((deviceIdEnc) => {
                                console.log('deviceIdEnc', deviceIdEnc);
                                this.http
                                  .post(
                                    this.apiUrl + 'test-handshake',
                                    dataEnc,
                                    {
                                      headers: new HttpHeaders({
                                        'Content-Type': 'application/json;',
                                        Accept: '*/*',
                                        'Access-Control-Allow-Origin': '*',
                                        'x-hs-page-id': keyFromServer,
                                        'co-prof-tranx': deviceIdEnc,
                                      }),
                                    }
                                  )
                                  .subscribe((res) => {
                                    console.log(res);
                                  });
                              });
                          });
                      });
                    }
                  });
              });
          });
      });
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

  alert(content: string, isRelease: boolean = true) {
    let data = new Alert();

    data.template = Template.Simple;
    data.title = 'Thông báo';
    data.content = content;

    const dialogRef = this.dialog.open(AlertComponent, {
      data: data,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result: Alert) => {
      if (isRelease) this.release();
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
              this.alert(`Có lỗi xảy ra: updateLogStep`);
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
          this.alert(`Có lỗi xảy ra: updateLogStep`);
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
            //this.router.navigate(['/aio/shared/capture-guide']);
            //this.router.navigate(['/aio/shared/collect-card-id']);
            this.router.navigate(['/aio/on-boarding/end']);
            //this.router.navigate(['/aio/shared/fill-info']);
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
            //this.router.navigate(['/aio/shared/capture-guide']);
            this.router.navigate(['/aio/update-card-id/recheck-info']);
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
    // this.updateLogStep();
    this.navigate();
  }

  fakeData() {
    this.http
      .get(this.testCaseURL + '?' + Utils.randomId(10))
      .subscribe((testCase: any) => {
        console.log(testCase);
        let data = testCase[0];
        console.log('fake data', data);
        let customerInfo = new CustomerInfo();
        customerInfo.fullName = data.fullName;
        customerInfo.customerID = data.customerID;
        customerInfo.customerIDOld = data.customerIDOld;
        customerInfo.gender = data.gender;
        customerInfo.dob = data.dob;
        customerInfo.mobileNo = data.mobileNo;
        customerInfo.nationality = data.nationality;
        customerInfo.towncountry = data.towncountry;
        customerInfo.expireDate = data.expireDate;
        customerInfo.issueDate = data.issueDate;
        customerInfo.address = data.address;

        let auths = data.authInfo.split(',');

        for (let i = 0; i < auths.length; i++) {
          let auth = new AuthenInfo();
          auth.authType = this.getAuthType(auths[i]);
          auth.authDesVN = '';
          this.authenInfo.push(auth);
        }

        this.customerInfo = customerInfo;
      });
  }

  getAuthType(value: any) {
    let result;

    switch (value) {
      case '1': {
        result = AuthType.SMSOTP;
        break;
      }
      case '2': {
        result = AuthType.DeviceToken;
        break;
      }
      case '3': {
        result = AuthType.mCodeOTP;
        break;
      }
      case '4': {
        result = AuthType.mConnect;
        break;
      }
      case '5': {
        result = AuthType.SMSTTT;
        break;
      }
      case '6': {
        result = AuthType.AdvToken;
        break;
      }
      case '8': {
        result = AuthType.SmartOTP;
        break;
      }
      case '9': {
        result = AuthType.SmartOTPCode;
        break;
      }
      default: {
        result = AuthType.None;
        break;
      }
    }

    return result;
  }
}
