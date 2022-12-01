import { Component, OnInit, Inject } from '@angular/core';
import { ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/aio.service';
import { MatDialog } from '@angular/material/dialog';
import { InputEmailComponent } from '../dialog/input-email/input-email.component';
import { CustomerInfo } from 'src/app/models/customer-info';
import { ContactAddressComponent } from '../dialog/contact-address/contact-address.component';

@Component({
  selector: 'app-verify-customer-info',
  templateUrl: './verify-customer-info.component.html',
  styleUrls: ['./verify-customer-info.component.css'],
})
export class VerifyCustomerInfoComponent implements OnInit {
  isLikeResidenceAddress = false;
  // email = '';
  constructor(public aioSvc: AioService, public dialog: MatDialog) {
    aioSvc.currentStep = ServiceStep.VerifyCustomerInfo;
  }

  ngOnInit(): void {}

  confirm() {
    this.aioSvc.next();
  }

  recieveInputKeyBoard(event: any) {
    console.log(event);
  }

  openInputEmailDialog() {
    const dialogRef = this.dialog.open(InputEmailComponent, {
      data: this.aioSvc.cusInfo.email,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.aioSvc.cusInfo.email = result;
      console.log(result);
      console.log('The dialog was closed', result);
    });
  }

  openContactAddressDialog() {
    const dialogRef = this.dialog.open(ContactAddressComponent, {
      data: this.aioSvc.cusInfo.contactAddress,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.aioSvc.cusInfo.contactAddress = result;
      }
      console.log(result);
      console.log('The ContactAddressDialog was closed', result);
    });
  }

  likeResidenceAddress() {
    console.log(this.isLikeResidenceAddress);
    this.aioSvc.cusInfo.contactAddress = this.isLikeResidenceAddress
      ? this.aioSvc.cusInfo.residenceAddress
      : '';
  }
}
