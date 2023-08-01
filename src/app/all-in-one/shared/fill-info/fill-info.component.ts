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
  styleUrls: ['./fill-info.component.css'],
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
    if (!environment.production) {
      // this.aioSvc.customerInfo.email = this.randomId(6) + '@gmail.com';
      // this.aioSvc.customerInfo.mobileNo = '0349' + this.randomId(6);
      // this.aioSvc.customerInfo.customerID = this.randomId(12);
    }
    this.findAddressByText();
    //TODO: remove hard
    // this.aioSvc.customerInfo.email = this.randomId(6) + '@gmail.com';
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
          this.aioSvc.alert(`Có lỗi xảy ra findAddressByText`);
          this.aioSvc.isProcessing = false;
        }
      },
      (err) => {
        console.log(err);
        this.aioSvc.alert(`Có lỗi xảy ra findAddressByText`);
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
          this.aioSvc.alert(`Có lỗi xảy ra getOccupations`);
          this.aioSvc.isProcessing = false;
        }
      },
      (err) => {
        this.aioSvc.isProcessing = false;
        this.aioSvc.alert(`Có lỗi xảy ra getOccupations`);
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
          this.aioSvc.alert(`Có lỗi xảy ra getProvinces`);
          this.aioSvc.isProcessing = false;
        }
      },
      (err) => {
        this.aioSvc.alert(`Có lỗi xảy ra getProvinces ${err}`);
        this.aioSvc.isProcessing = false;
      }
    );
  }

  openContactAddressDialog() {
    const dialogRef = this.dialog.open(ContactAddressComponent, {
      data: this.provinces,
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

  openMobileNoDialog() {
    const dialogRef = this.dialog.open(InputMobileNumberComponent, {
      data: this.aioSvc.customerInfo.mobileNo
        ? this.aioSvc.customerInfo.mobileNo
        : '',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        //   this.currentOcc = result;
        this.aioSvc.customerInfo.mobileNo = result;
      }
      console.log(result);
      console.log('The MobileNoDialog was closed', result);
    });
  }

  confirm() {
    if (
      this.aioSvc.customerInfo.mobileNo &&
      this.aioSvc.customerInfo.jobCode &&
      this.aioSvc.customerInfo.contactAddress
    ) {
      this.aioSvc.next();
    } else {
      return;
    }
  }
}
