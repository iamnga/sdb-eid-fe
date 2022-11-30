import { Component, OnInit } from '@angular/core';
import { AccountType, AlertType, ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/aio.service';

@Component({
  selector: 'app-account-and-alert',
  templateUrl: './account-and-alert.component.html',
  styleUrls: ['./account-and-alert.component.css'],
})
export class AccountAndAlertComponent implements OnInit {
  public accountType = AccountType;
  public alertType = AlertType;
  currentAccountType = this.accountType.None;
  currentAlertType = this.alertType.None;

  constructor(private aioSvc: AioService) {
    aioSvc.currentStep = ServiceStep.AccountAndAlert;
  }

  ngOnInit(): void {}

  selectAccountType(type: any) {
    this.currentAccountType = type;
    console.log(this.currentAccountType);
  }

  selectAlertType(type: any) {
    this.currentAlertType = type;
    console.log(this.currentAlertType);
  }

  confirm() {
    this.aioSvc.next();
  }
}
