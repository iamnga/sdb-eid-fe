import { Component, OnInit } from '@angular/core';
import { ServiceStep } from 'src/app/models/enum';
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

  input: AnimationOptions = {
    path: 'assets/all-in-one/shared/img/cccd-vantay.json',
  };
  check: AnimationOptions = {
    path: 'assets/all-in-one/shared/img/check.json',
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
    websocketService.messages.subscribe(
      (msg: any) => {
        console.log(msg);
        this.fpResponse = msg;
        if (this.fpResponse.quality > 0 && this.hasIcaoResponse == false) {
          if (
            this.fpResponse.icaoResponse &&
            this.fpResponse.icaoResponse.success
          ) {
            this.hasIcaoResponse = true;
            console.log(this.fpResponse);
            this.fpResponse.image =
              'data:image/png;base64,' + this.fpResponse.image;
            console.log(
              'Response from websocket: ' + this.fpResponse.verifyResponse
            );
            //Success do something
            this.mappingData();
            setTimeout(() => {
              this.aioSvc.next();
            }, 3000);
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

    this.aioSvc.customerInfo = customerInfo;

    console.log(this.aioSvc.customerInfo);
  }

  recallMkFingerPrint() {
    this.fpResponse = new FingerResponse();
    this.callMkFingerPrint();
  }
}
