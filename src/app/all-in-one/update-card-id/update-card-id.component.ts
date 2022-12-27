import { Component, OnInit } from '@angular/core';
import {
  CheckCustomerSDBRequestData,
  CustomerUpdateData,
  GetAuthMethodRequestData,
  UpdateCustomerRequestData,
} from 'src/app/models/aio';
import { ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/aio.service';
import Utils from '../shared/utils/utils';

@Component({
  selector: 'app-update-card-id',
  templateUrl: './update-card-id.component.html',
  styleUrls: ['./update-card-id.component.css'],
})
export class UpdateCardIdComponent implements OnInit {
  customerUpdateData = new CustomerUpdateData();
  updateCustomerRequestData = new UpdateCustomerRequestData();
  constructor(private aioSvc: AioService) {
    aioSvc.currentStep = ServiceStep.UpdateCustomerInfo;
  }

  ngOnInit(): void {
    this.updateCustomer();
  }

  updateCustomer() {
    let data = new CheckCustomerSDBRequestData();

    data.cifNo = '';
    data.customerID = this.aioSvc.checkCustomerByIdNoResponseData.legalId;
    data.customerType = '1';
    data.dob = this.aioSvc.checkCustomerByIdNoResponseData.birthIncorpDate;
    data.fullName = this.aioSvc.checkCustomerByIdNoResponseData.name;
    data.isEdit = true;
    data.mobileNo = this.aioSvc.checkCustomerByIdNoResponseData.mobileNumber;
    data.serviceType = 'CI';
    data.email = this.aioSvc.checkCustomerByIdNoResponseData.email;
    data.residentAddress = this.aioSvc.checkCustomerByIdNoResponseData.street;

    this.aioSvc.checkCustomerSDB(data).subscribe(
      (res: any) => {
        if (res.respCode == '00') {
          this.customerUpdateData.customerIDOld =
            this.aioSvc.customerInfo.customerIDOld;
          this.customerUpdateData.customerIDNew =
            this.aioSvc.customerInfo.customerID;
          this.customerUpdateData.expDate = Utils.formatDate(
            this.aioSvc.customerInfo.expireDate
          );
          this.customerUpdateData.issDate = Utils.formatDate(
            this.aioSvc.customerInfo.issueDate
          );
          this.customerUpdateData.issPlace = Utils.issPlace;
          this.customerUpdateData.isUpdateAddress = false;
          this.customerUpdateData.qrContent = 'thisIsQRContent';
          this.customerUpdateData.addressCityCode = '';
          this.customerUpdateData.addressCityName = '';
          this.customerUpdateData.addressDistrictCode = '';
          this.customerUpdateData.addressDistrictName = '';
          this.customerUpdateData.addressStreet = '';
          this.customerUpdateData.addressWardCode = '';
          this.customerUpdateData.addressWardName = '';

          this.updateCustomerRequestData.customerUpdate =
            this.customerUpdateData;

          this.updateCustomerRequestData.cifNo =
            this.aioSvc.checkCustomerByIdNoResponseData.cifNo;
          this.updateCustomerRequestData.branchCode =
            this.aioSvc.checkCustomerByIdNoResponseData.companyBook;
          this.updateCustomerRequestData.mobileNo =
            this.aioSvc.checkCustomerByIdNoResponseData.mobileNumber;

          this.aioSvc.updateCustomer(this.updateCustomerRequestData).subscribe(
            (res: any) => {
              console.log(res);
              this.aioSvc.isProcessing = false;
              if (res.respCode == '00') {
                this.aioSvc.next();
              } else {
                this.aioSvc.alert(`Có lỗi xảy ra updateCustomer`);
              }
            },
            (err) => {
              this.aioSvc.alert(`Có lỗi xảy ra updateCustomer`);
              this.aioSvc.isProcessing = false;

              console.log(err);
            }
          );
        } else {
          this.aioSvc.alert(`Có lỗi xảy ra checkCustomerSDB`);
          this.aioSvc.isProcessing = false;
        }
      },
      (err) => {
        this.aioSvc.alert(`Có lỗi xảy ra checkCustomerSDB`);
        this.aioSvc.isProcessing = false;
      }
    );
  }
}
