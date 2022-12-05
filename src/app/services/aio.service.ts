import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AllInOneRequest } from '../models/aio';
import { CustomerInfo } from '../models/customer-info';
import { Service, ServiceStep } from '../models/enum';

@Injectable({
  providedIn: 'root',
})
export class AioService {
  currentSerice = Service.None;
  currentStep = ServiceStep.DashBoard;
  cusInfo: CustomerInfo = new CustomerInfo();
  isProcessing = false;

  constructor(private router: Router, private http: HttpClient) {
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
  next() {
    if ((this.currentSerice = Service.OnBoarding)) {
      this.router.navigate(['/aio/on-boarding']);
    }
  }

  create() {
    this.isProcessing = true;
    this.getProvinces();
  }

  release() {
    this.isProcessing = false;
    this.currentSerice = Service.None;
    this.currentStep = ServiceStep.DashBoard;
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

  // API

  getSessionId() {
    // this.http.post()

    this.http
      .get(
        'https://cardtest.sacombank.com.vn:9448/cardservice/api/banner-cards/Home'
      )
      .subscribe(
        (rs) => {
          console.log(rs);
        },
        (err) => {}
      );
  }

  getProvinces() {
    let req = new AllInOneRequest();
    let header = new HttpHeaders();

    const headerDict = {
      'Content-Type': 'application/json',
      Accept: '*/*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': '*',
    };

    // const requestOptions = {
    //   headers: new Headers(headerDict),
    // };

    header.append('Access-Control-Allow-Origin', '*');
    req.refNumber = '123456';
    req.refDateTime = new Date().toISOString().replace('Z', '');
    this.http
      .post('https://cardtest.sacombank.com.vn:9443/digizone/provinces', req, {
        headers: new HttpHeaders(headerDict),
      })
      .subscribe(
        (res) => {
          console.log(res);
        },
        (err) => {}
      );
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
