import { Component, OnInit } from '@angular/core';
import { ServiceStep } from 'src/app/models/enum';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { AioService } from 'src/app/services/all-in-one/aio.service';

@Component({
  selector: 'app-verify-customer-info',
  templateUrl: './verify-customer-info.component.html',
  styleUrls: ['./verify-customer-info.component.css'],
})
export class VerifyCustomerInfoComponent implements OnInit {
  face = '';

  constructor(public aioSvc: AioService, public dialog: MatDialog) {
    aioSvc.currentStep = ServiceStep.VerifyCustomerInfo;
  }

  ngOnInit(): void {
    console.log('verify: ', this.aioSvc.customerInfo);
    if (environment.production) {
      this.checkCustomerByIdNo(this.randomId(12));
    } else {
      this.face = this.aioSvc.faceCaptured;
      this.checkCustomerByIdNo('051095009392');
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

  checkCustomerByIdNo(customerId: string) {
    console.log(this.aioSvc.customerInfo);
    this.aioSvc.checkCustomerByIdNo(customerId).subscribe(
      (res: any) => {
        this.aioSvc.isProcessing = false;

        if (res.respCode == '14') {
          this.face = this.aioSvc.faceCaptured;
        } else if (res.respCode == '00') {
          this.aioSvc.alert(
            `Quý khách đã có tài khoản tại Sacombank <br> Xin cảm ơn Quý khách đã quan tâm dịch vụ`
          );
        } else {
          this.aioSvc.alert(`Có lỗi xảy ra checkCustomerByIdNo`);
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

  confirm() {
    this.aioSvc.next();
  }
}
