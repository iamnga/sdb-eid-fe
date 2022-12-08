import { Component, OnInit, Inject } from '@angular/core';
import { ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/aio.service';

@Component({
  selector: 'app-collect-card-id',
  templateUrl: './collect-card-id.component.html',
  styleUrls: ['./collect-card-id.component.css'],
})
export class CollectCardIdComponent implements OnInit {
  qrValue = '';

  constructor(
    @Inject('BASE_URL') private baseUrl: string,
    private aioSvc: AioService
  ) {
    aioSvc.currentStep = ServiceStep.CollectCardId;
  }

  ngOnInit(): void {
    this.genQR();
  }

  checkCustomerByIdNo() {
    this.aioSvc.checkCustomerByIdNo('').subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  genQR() {
    this.qrValue =
      this.baseUrl +
      'collect/' +
      this.aioSvc.deviceID +
      '/' +
      this.aioSvc.sessionID;
  }

  next() {
    this.checkCustomerByIdNo();
    // this.aioSvc.next();
  }
}
