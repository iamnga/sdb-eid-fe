import { Component, OnInit } from '@angular/core';
import { Service, ServiceStep } from 'src/app/models/enum';
import { FingerResponse } from 'src/app/models/mk';
import { WebsocketService } from 'src/app/services/websocket.service';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { Alert, Template } from 'src/app/models/alert';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../dialog/alert/alert.component';
import { CustomerInfo } from 'src/app/models/aio';
import { AioService } from 'src/app/services/all-in-one/aio.service';

@Component({
  selector: 'app-input-finger',
  templateUrl: './input-finger.component.html',
  styleUrls: ['./input-finger.component.css'],
})
export class InputFingerComponent implements OnInit {
  fpResponse: FingerResponse = new FingerResponse();
  hasIcaoResponse = false;
  isScanning = false;

  input: AnimationOptions = {
    path: 'assets/all-in-one/shared/img/cccd-vantay.json',
  };
  check: AnimationOptions = {
    path: 'assets/all-in-one/shared/img/check.json',
  };
  fingerScan: AnimationOptions = {
    path: 'assets/all-in-one/shared/img/finger_scan.json',
  };

  constructor(private aioSvc: AioService, public dialog: MatDialog) {
    aioSvc.currentStep = ServiceStep.InputFinger;
  }

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }

  ngOnInit(): void {
    this.callMkFingerPrint();
    //TODO: remove test API
    // this.aioSvc.getListAccount('17856216').subscribe((res) => {
    //   console.log(res)
    // })
  }

  callMkFingerPrint() {
    let websocketService = new WebsocketService();
    websocketService.messages.subscribe(
      (msg: any) => {
        console.log(msg);
        this.fpResponse = msg;
        if (this.fpResponse.quality > 0) {
          this.isScanning = true;
        }
        if (this.fpResponse.verifyResponse != null && this.hasIcaoResponse == false) {
          this.isScanning = false;
          if (
            this.fpResponse.verifyResponse.success
          ) {
            this.hasIcaoResponse = true;
            if (this.fpResponse.icaoResponse.success && this.fpResponse.icaoResponse.data.dg13) {
              console.log(this.fpResponse);
              this.fpResponse.image =
                'data:image/png;base64,' + this.fpResponse.image;
              console.log(
                'Response from websocket: ' + this.fpResponse.verifyResponse
              );

              this.mappingData();
              this.aioSvc.next();
            }
            else {
              this.aioSvc.alert(
                `Đọc thông tin không thành công`
              );
            }
          } else {
            if (this.aioSvc.fpAttemp == 2) {

              this.aioSvc.alert(
                `Quý khách đã xác thực thất bại <br>quá số lần quy định`
              );

            } else {
              this.alert();
            }
          }
        }
      },
      (err) => {
        this.aioSvc.alert(`Có lỗi xảy ra callMkFingerPrint`);
        console.log(err);
      }
    );
  }

  alert() {
    let data = new Alert();

    data.template = Template.FingerPrintFailed;
    data.title = 'Thông báo';

    const dialogRef = this.dialog.open(AlertComponent, {
      data: data,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result: Alert) => {
      if (result) {
        if (result.action == 'back') {
          this.aioSvc.release();
        } else {
          this.aioSvc.fpAttemp++;
          this.recallMkFingerPrint();
        }
      } else {
        this.aioSvc.release();
      }
      console.log(result);
    });
  }

  mappingData() {
    if (this.fpResponse.icaoResponse.data.dg13) {
      if (
        this.checkDateOfExpiry(
          this.fpResponse.icaoResponse.data.dg13.dateOfExpiry
        )
      ) {
        let customerInfo = new CustomerInfo();
        let dg13 = this.fpResponse.icaoResponse.data.dg13;

        customerInfo.address = dg13.residenceAddress;
        customerInfo.dob = dg13.dateOfBirth;
        customerInfo.gender = dg13.gender;
        customerInfo.customerID = dg13.idCardNo;
        customerInfo.customerIDOld = dg13.oldIdCardNumber;
        customerInfo.nationality = dg13.nationality;
        customerInfo.towncountry = dg13.placeOfOrigin;
        customerInfo.fullName = dg13.name;
        customerInfo.expireDate = dg13.dateOfExpiry;
        customerInfo.issueDate = dg13.dateOfIssuance;
        customerInfo.issuePlace = 'CTCCSQLHCVTTXH';

        this.aioSvc.customerInfo = customerInfo;

        console.log(this.aioSvc.customerInfo);

        //TODO: Check customer info
      } else {
        this.aioSvc.alert(`CCCD của Quý khách đã hết hạn`);
      }
    } else {
      this.aioSvc.alert(`Có lỗi xảy ra, không lấy được thông tin từ CCCD`);
    }
  }

  checkDateOfExpiry(dateOfExpiry: string) {
    let arr = dateOfExpiry.split('/');
    let newDateOfExpiry = arr[1] + '/' + arr[0] + '/' + arr[2];
    let dateExp = new Date(newDateOfExpiry);
    let now = new Date();
    now.setHours(0, 0, 0, 0);
    return dateExp.getTime() - now.getTime() > 0 ? true : false;
  }

  recallMkFingerPrint() {
    this.fpResponse = new FingerResponse();
    this.callMkFingerPrint();
  }
}
