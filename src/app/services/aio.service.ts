import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerInfo } from '../models/customer-info';
import { Service, ServiceStep } from '../models/enum';

@Injectable({
  providedIn: 'root',
})
export class AioService {
  currentSerice = Service.None;
  currentStep = ServiceStep.DashBoard;
  cusInfo: CustomerInfo = new CustomerInfo();
  constructor(private router: Router) {
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
