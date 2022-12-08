import { Component, OnInit, Inject } from '@angular/core';
import { ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/aio.service';
import { MatDialog } from '@angular/material/dialog';
import { InputEmailComponent } from '../dialog/input-email/input-email.component';
import { ContactAddressComponent } from '../dialog/contact-address/contact-address.component';
import { JobComponent } from '../dialog/job/job.component';
import { AddressData, AddressInfo, Occupations } from 'src/app/models/aio';

@Component({
  selector: 'app-verify-customer-info',
  templateUrl: './verify-customer-info.component.html',
  styleUrls: ['./verify-customer-info.component.css'],
})
export class VerifyCustomerInfoComponent implements OnInit {
  isLikeResidenceAddress = false;
  face = '';
  occupations: Occupations[] = [];
  contactAddress = '';
  currentOcc: Occupations;
  provinces: AddressData[] = [];

  // email = '';
  constructor(public aioSvc: AioService, public dialog: MatDialog) {
    aioSvc.currentStep = ServiceStep.VerifyCustomerInfo;
  }

  ngOnInit(): void {
    console.log('verify: ', this.aioSvc.customerInfo);
    this.checkCustomerByIdNo(this.randomId());
  }

  randomId() {
    var result = '';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 9; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  checkCustomerByIdNo(customerId: string) {
    this.aioSvc.isProcessing = true;
    this.aioSvc.checkCustomerByIdNo(customerId).subscribe(
      (res: any) => {
        if (res.respCode == '14') {
          let faceC = localStorage.getItem('face-captured');
          this.face = faceC ? faceC : '';
          this.aioSvc.customerInfo.email = 'minhngaag@gmail.com';
          this.aioSvc.customerInfo.mobileNo = '0349444450';
          this.aioSvc.customerInfo.customerID = customerId;
          this.findAddressByText();
        } else if (res.respCode == '00') {
          this.aioSvc.alert(
            `Quý khách đã có tài khoản tại Sacombank <br> Xin cảm ơn Quý khách đã quan tâm dịch vụ`
          );
        } else {
          this.aioSvc.alert(`Có lỗi xảy ra checkCustomerByIdNo`);
          this.aioSvc.isProcessing = false;
        }
        console.log(res);
      },
      (err) => {
        this.aioSvc.alert(`Có lỗi xảy ra checkCustomerByIdNo`);
        this.aioSvc.isProcessing = false;

        console.log(err);
      }
    );
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

  confirm() {
    if (
      this.aioSvc.customerInfo.email &&
      this.aioSvc.customerInfo.jobCode &&
      this.aioSvc.customerInfo.contactAddress
    ) {
      this.aioSvc.next();
    } else {
      return;
    }
  }

  recieveInputKeyBoard(event: any) {
    console.log(event);
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
        this.aioSvc.isProcessing = false;
        console.log(res);
        if (res.data.provinces) {
          this.provinces = res.data.provinces;
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

  openInputEmailDialog() {
    const dialogRef = this.dialog.open(InputEmailComponent, {
      data: this.aioSvc.customerInfo.email,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.aioSvc.customerInfo.email = result;
      console.log(result);
      console.log('The dialog was closed', result);
    });
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
      console.log('The ContactAddressDialog was closed', result);
    });
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
}
