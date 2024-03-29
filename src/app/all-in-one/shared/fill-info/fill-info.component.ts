import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddressData, AddressInfo, Occupations } from 'src/app/models/aio';
import { ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/all-in-one/aio.service';
import { environment } from 'src/environments/environment';
import { ContactAddressComponent } from '../dialog/contact-address/contact-address.component';
import { InputEmailComponent } from '../dialog/input-email/input-email.component';
import { InputMobileNumberComponent } from '../dialog/input-mobile-number/input-mobile-number.component';
import { JobComponent } from '../dialog/job/job.component';

@Component({
  selector: 'app-fill-info',
  templateUrl: './fill-info.component.html',
  styleUrls: ['./fill-info.component.css', '../../all-in-one.component.css'],
})
export class FillInfoComponent implements OnInit {
  isLikeResidenceAddress = false;
  contactAddress = '';
  occupations: Occupations[] = [];
  currentOcc: Occupations;
  provinces: AddressData[] = [];

  constructor(public aioSvc: AioService, public dialog: MatDialog) {
    this.aioSvc.currentStep = ServiceStep.FillInfo;
  }

  ngOnInit(): void {
    this.findAddressByText();
  }

  likeResidenceAddress() {
    console.log(this.isLikeResidenceAddress);
    if (this.isLikeResidenceAddress) {
      this.contactAddress = this.aioSvc.customerInfo.address;
      this.aioSvc.customerInfo.contactAddress =
        this.aioSvc.customerInfo.residentialAddress;
    } else {
      this.contactAddress = '';
      this.aioSvc.customerInfo.contactAddress = new AddressInfo();
    }
  }

  randomId(length: number) {
    var result = '';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  findAddressByText() {
    this.aioSvc.findAddressByText(this.aioSvc.customerInfo.address).subscribe(
      (res: any) => {
        console.log(res);
        if (res.respCode == '00') {
          this.aioSvc.customerInfo.residentialAddress = res.data;
          this.getOccupations();
        } else {
          this.aioSvc.alertWithGoHome();
          this.aioSvc.isProcessing = false;
        }
      },
      (err) => {
        console.log(err);
        this.aioSvc.alertWithGoHome();
        this.aioSvc.isProcessing = false;
      }
    );
  }

  getOccupations() {
    this.aioSvc.getOccupations().subscribe(
      (res: any) => {
        console.log(res);
        if (res.data.occupations) {
          this.occupations = res.data.occupations;
          this.getProvinces();
        } else {
          this.aioSvc.alertWithGoHome();
          this.aioSvc.isProcessing = false;
        }
      },
      (err) => {
        this.aioSvc.isProcessing = false;
        this.aioSvc.alertWithGoHome();
      }
    );
  }

  getProvinces() {
    this.aioSvc.getProvinces().subscribe(
      (res: any) => {
        console.log(res);
        if (res.data.provinces) {
          this.provinces = res.data.provinces;
          this.aioSvc.isProcessing = false;
        } else {
          this.aioSvc.alertWithGoHome();
          this.aioSvc.isProcessing = false;
        }
      },
      (err) => {
        this.aioSvc.alertWithGoHome();
        this.aioSvc.isProcessing = false;
      }
    );
  }

  openContactAddressDialog() {
    const dialogRef = this.dialog.open(ContactAddressComponent, {
      data: this.provinces,
      panelClass: 'bg-color'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.aioSvc.customerInfo.contactAddress = result;
        this.contactAddress = this.concatAddress(result);
      }
      console.log(result);
      console.log('The ContactAddressDialog was closed', result);
    });
  }

  concatAddress(adrInfo: AddressInfo) {
    return `${adrInfo.street}, ${adrInfo.wardName}, ${adrInfo.districtName}, ${adrInfo.provinceName}`;
  }

  openInputEmailDialog() {
    const dialogRef = this.dialog.open(InputEmailComponent, {
      data: this.aioSvc.customerInfo.email,
      panelClass: 'bg-color'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.aioSvc.customerInfo.email = result;
      console.log(result);
      console.log('The InputEmailDialog was closed', result);
    });
  }

  openJobDialog() {
    const dialogRef = this.dialog.open(JobComponent, {
      data: this.occupations,
      panelClass: 'bg-color'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.currentOcc = result;
        this.aioSvc.customerInfo.jobCode = this.currentOcc.code;
      }
      console.log(result);
      console.log('The JobDialog was closed', result);
    });
  }

  confirm() {
    if (
      this.aioSvc.customerInfo.jobCode &&
      this.aioSvc.customerInfo.contactAddress
    ) {
      this.aioSvc.next();
    } else {
      return;
    }
  }
}
