import { Component } from '@angular/core';
import {
  AddressInfo,
  CheckCustomerByIdNoResponseData,
  CheckCustomerSDBRequestData,
  CheckCustomerSDBResponseData,
  CurrentDocInfo,
  CustomerInfo,
  CustomerUpdateData,
  UpdateCustomerRequestData,
} from 'src/app/models/aio';
import { ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/all-in-one/aio.service';

@Component({
  selector: 'app-recheck-info',
  templateUrl: './recheck-info.component.html',
  styleUrls: ['./recheck-info.component.css', '../../all-in-one.component.css'],
})
export class RecheckInfoComponent {

  currentCustomerInfo = new CheckCustomerSDBResponseData();
  newCustomerInfo = new CustomerInfo();
  constructor(public aioSvc: AioService) {
    this.aioSvc.currentStep = ServiceStep.RecheckInfo;
    this.currentCustomerInfo = aioSvc.checkCustomerSDBResponseData;
    this.newCustomerInfo = aioSvc.customerInfo;
  }

  confirm() {
    this.aioSvc.next();
  }

  concatAddress(adrInfo: AddressInfo) {
    return `${adrInfo.street}, ${adrInfo.wardName}, ${adrInfo.districtName}, ${adrInfo.provinceName}`;
  }
}
