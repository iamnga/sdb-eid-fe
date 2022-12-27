import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OpenAccountRequestData } from 'src/app/models/aio';
import { ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/aio.service';
import Utils from '../shared/utils/utils';

@Component({
  selector: 'app-on-boarding',
  templateUrl: './on-boarding.component.html',
  styleUrls: ['./on-boarding.component.css'],
})
export class OnBoardingComponent implements OnInit {
  idEKYCPersonal = '';
  cifNo = '';
  constructor(private aioSvc: AioService) {
    this.aioSvc.currentStep = ServiceStep.CustomerEnroll;
  }

  ngOnInit(): void {
    this.customerEnroll();
  }

  customerEnroll() {
    this.aioSvc.customerEnrollInfo.customerInfo = this.aioSvc.customerInfo;
    this.aioSvc.customerEnrollInfo.registerAlert = this.aioSvc.registerAlert;
    this.formatCustomerInfoData();
    console.log(this.aioSvc.customerEnrollInfo);
    this.aioSvc.customerEnroll().subscribe(
      (res: any) => {
        console.log('customerEnroll', res);
        if (res.respCode == '00') {
          this.idEKYCPersonal = res.data.idEKYCPersonal;
          this.cifNo = res.data.cifNo;
          this.openAccount();
        } else {
          this.aioSvc.alert(`Có lỗi xảy ra customerEnroll`);
          this.aioSvc.isProcessing = false;
        }
      },
      (err) => {
        console.log(err);
        this.aioSvc.alert(`Có lỗi xảy ra customerEnroll`);
        this.aioSvc.isProcessing = false;
      }
    );
  }

  formatCustomerInfoData() {
    this.aioSvc.customerEnrollInfo.customerInfo.gender =
      this.aioSvc.customerEnrollInfo.customerInfo.gender.toLocaleLowerCase() ==
      'nam'
        ? 'M'
        : 'F';
    this.aioSvc.customerEnrollInfo.customerInfo.dob = Utils.formatDate(
      this.aioSvc.customerEnrollInfo.customerInfo.dob
    );

    this.aioSvc.customerEnrollInfo.customerInfo.issueDate = Utils.formatDate(
      this.aioSvc.customerEnrollInfo.customerInfo.issueDate
    );

    this.aioSvc.customerEnrollInfo.customerInfo.expireDate = Utils.formatDate(
      this.aioSvc.customerEnrollInfo.customerInfo.expireDate
    );

    this.aioSvc.customerEnrollInfo.customerInfo.country = 'VN';
    this.aioSvc.customerEnrollInfo.customerInfo.customerType = '1';
    this.aioSvc.customerEnrollInfo.customerInfo.categoryCustomer = 'N';
    this.aioSvc.customerEnrollInfo.customerInfo.issuePlace = 'CTCCSQLHCVTTXH';
    //TODO
    this.aioSvc.customerEnrollInfo.customerInfo.issueDate = '20200101';
  }

  openAccount() {
    let data = new OpenAccountRequestData();
    data.registerAlert = this.aioSvc.customerEnrollInfo.registerAlert;
    data.fullName = this.aioSvc.customerEnrollInfo.customerInfo.fullName;
    data.mobileNo =
      '84' + this.aioSvc.customerEnrollInfo.customerInfo.mobileNo.substr(-9);
    data.accountCurrency = this.aioSvc.customerEnrollInfo.accountCurrency;
    data.accountType = this.aioSvc.customerEnrollInfo.accountType;
    data.branchCode = this.aioSvc.customerEnrollInfo.branchCode;
    data.cifNo = this.cifNo;
    data.idEKYCPersonal = this.idEKYCPersonal;
    data.prefixNumberAccount =
      this.aioSvc.customerEnrollInfo.prefixNumberAccount;

    this.aioSvc.openAccount(data).subscribe(
      (res: any) => {
        console.log(res);
        this.aioSvc.isProcessing = false;
        if (res.respCode == '00') {
          this.aioSvc.openAccountResponseData = res.data;
          this.aioSvc.next();
        } else {
          this.aioSvc.alert(`Có lỗi xảy ra openAccount`);
        }
      },
      (err) => {
        console.log(err);
        this.aioSvc.alert(`Có lỗi xảy ra openAccount`);
        this.aioSvc.isProcessing = false;
      }
    );
  }
}
