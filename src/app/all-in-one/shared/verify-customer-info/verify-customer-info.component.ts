import { Component } from '@angular/core';
import { ServiceStep } from 'src/app/models/enum';
import { MatDialog } from '@angular/material/dialog';
import { AioService } from 'src/app/services/all-in-one/aio.service';

@Component({
  selector: 'app-verify-customer-info',
  templateUrl: './verify-customer-info.component.html',
  styleUrls: ['./verify-customer-info.component.css', '../../all-in-one.component.css'],
})
export class VerifyCustomerInfoComponent {
  face = '';

  constructor(public aioSvc: AioService, public dialog: MatDialog) {
    aioSvc.currentStep = ServiceStep.VerifyCustomerInfo;
  }

  
  confirm() {
    this.aioSvc.next();
  }
}
