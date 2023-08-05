import { Component, OnInit, OnDestroy } from '@angular/core';
import { Service, ServiceStep } from 'src/app/models/enum';
import { FingerResponse } from 'src/app/models/mk';
import { WebsocketService } from 'src/app/services/websocket.service';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { Alert } from 'src/app/models/alert';
import { MatDialog } from '@angular/material/dialog';
import { CustomerInfo } from 'src/app/models/aio';
import { AioService } from 'src/app/services/all-in-one/aio.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-input-finger',
  templateUrl: './input-finger.component.html',
  styleUrls: ['./input-finger.component.css'],
})
export class InputFingerComponent implements OnInit, OnDestroy {
  fpResponse: FingerResponse = new FingerResponse();
  hasIcaoResponse = false;
  isScanning = false;
  private mkSubscription!: Subscription;

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
  }

  callMkFingerPrint() {
    let websocketService = new WebsocketService();
    this.mkSubscription = websocketService.messages.subscribe(
      (msg: any) => {
        if (msg) {
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
                this.aioSvc.alertWithGoHome(
                  `Đọc thông tin không thành công`
                );
              }
            }
            // Lỗi FINGERPRINT READER CANNOT OPENED - do không nhận được thiết bị đọc CCCD chip
            else if (this.fpResponse.verifyResponse.code === "218") {
              this.aioSvc.alertWithGoHome(`Dịch vụ không thể thực hiện lúc này <br> do không nhận được thiết bị đọc CCCD chip`);
            }
            else {
              if (this.aioSvc.fpAttemp == 2) {

                this.aioSvc.alertWithGoHome(
                  `Quý khách đã xác thực thất bại <br>quá số lần quy định`
                );

              } else {
                this.aioSvc.alertWithAction(`Xác thực vân tay không thành công`, ``, `Thoát`, `Thử lại`).subscribe((res: Alert) => {
                  if (res) {
                    if (res.action === "pri") {
                      this.aioSvc.fpAttemp++;
                      this.recallMkFingerPrint();
                    }
                    else {
                      this.aioSvc.release();
                    }
                  }
                  else {
                    this.aioSvc.release();
                  }
                })
              }
            }
          }
        }
        else {
          this.aioSvc.alertWithGoHome(`Dịch vụ không thể thực hiện lúc này`);
        }
      },
      (err) => {
        this.aioSvc.alertWithGoHome(`Dịch vụ không thể thực hiện lúc này`);
        console.log(err);
      }
    );
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
        customerInfo.customerType = '1'; // 1: CCCD/CMND - 2: Passport

        this.aioSvc.customerInfo = customerInfo;

        console.log(this.aioSvc.customerInfo);
      } else {
        this.aioSvc.alertWithGoHome(`CCCD của Quý khách đã hết hạn`);
      }
    } else {
      this.aioSvc.alertWithGoHome(`Đọc thông tin không thành công`);
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

  ngOnDestroy(): void {
    this.mkSubscription.unsubscribe();
  }
}
