import { Component, OnInit } from '@angular/core';
import { ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/aio.service';

@Component({
  selector: 'app-account-and-alert',
  templateUrl: './account-and-alert.component.html',
  styleUrls: ['./account-and-alert.component.css'],
})
export class AccountAndAlertComponent implements OnInit {
  constructor(private aioSvc: AioService) {
    aioSvc.currentStep = ServiceStep.AccountAndAlert;
  }

  ngOnInit(): void {}

  confirm() {
    this.aioSvc.next();
  }
}
