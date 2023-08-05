import { Component, OnInit } from '@angular/core';
import {
  CheckCustomerByIdNoResponseData,
  CheckCustomerSDBRequestData,
  CurrentDocInfo,
  CustomerUpdateData,
  UpdateCustomerRequestData,
} from 'src/app/models/aio';
import { ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/all-in-one/aio.service';
import Utils from '../../shared/utils/utils';

@Component({
  selector: 'app-recheck-info',
  templateUrl: './recheck-info.component.html',
  styleUrls: ['./recheck-info.component.css', '../../all-in-one.component.css'],
})
export class RecheckInfoComponent implements OnInit {
  updateCustomerRequestData = new UpdateCustomerRequestData();
  checkCustomerSDBRequestData = new CheckCustomerSDBRequestData();
  customerUpdateData = new CustomerUpdateData();
  currentDocInfo = new CurrentDocInfo();
  data: any;
  checkCustomerByIdNoResponseData = new CheckCustomerByIdNoResponseData();

  constructor(public aioSvc: AioService) {
    this.aioSvc.currentStep = ServiceStep.RecheckInfo;
  }

  ngOnInit(): void {
    // this.aioSvc.fakeData();
    // setTimeout(() => {
    //   this.checkCustomerByIdNo(this.aioSvc.customerInfo.customerIDOld);
    // }, 1000);
  }

  checkCustomerByIdNo(customerId: string) {
    console.log(this.aioSvc.customerInfo);
    let req = new CheckCustomerSDBRequestData()

    this.aioSvc.checkCustomerSDB(req).subscribe(
      (res: any) => {
        console.log(res);

        if (res.respCode == '14') {
          this.aioSvc.isProcessing = false;
          this.aioSvc.alert(
            `Quý khách chưa có tài khoản tại Sacombank <br> Quý khách vui lòng quay về trang chủ và chọn chức năng Mở tài khoản nếu có nhu cầu`
          );
        } else if (res.respCode == '00') {
          this.aioSvc.checkCustomerByIdNoResponseData = res.data;
          this.currentDocInfo.customerID =
            this.aioSvc.checkCustomerByIdNoResponseData.legalId;
          this.currentDocInfo.address =
            this.aioSvc.checkCustomerByIdNoResponseData.street;
          this.currentDocInfo.issueDate = Utils.strToDate(
            this.aioSvc.checkCustomerByIdNoResponseData.legalIssDate
          );
          this.currentDocInfo.issuePlace =
            this.aioSvc.checkCustomerByIdNoResponseData.legalIssAuth;

          this.updateCustomerRequestData.branchCode =
            this.aioSvc.checkCustomerByIdNoResponseData.companyBook;
          this.updateCustomerRequestData.cifNo =
            this.aioSvc.checkCustomerByIdNoResponseData.cifNo;
          this.updateCustomerRequestData.mobileNo =
            this.aioSvc.checkCustomerByIdNoResponseData.mobileNumber;
          this.aioSvc.isProcessing = false;
        } else {
          this.aioSvc.alertWithGoHome();
        }
      },
      (err: any) => {
        this.aioSvc.alertWithGoHome();
        console.log(err);
      }
    );
  }

  confirm() {
    this.aioSvc.next();
  }
}
