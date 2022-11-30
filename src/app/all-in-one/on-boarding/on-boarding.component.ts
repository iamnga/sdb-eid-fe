import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Service, ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/aio.service';

@Component({
  selector: 'app-on-boarding',
  templateUrl: './on-boarding.component.html',
  styleUrls: ['./on-boarding.component.css'],
})
export class OnBoardingComponent implements OnInit {
  ssid = '';
  constructor(private router: Router, private aioSvc: AioService) {
    aioSvc.currentSerice = Service.OnBoarding;
  }

  ngOnInit(): void {
    console.log(this.aioSvc.currentStep);
    this.router.navigate(['/aio/shared/verify-customer-info']);
    // switch (this.aioSvc.currentStep) {
    //   case ServiceStep.DashBoard: {
    //     this.router.navigate(['/aio/shared/capture-guide']);
    //     break;
    //   }
    //   case ServiceStep.CaptureGuide: {
    //     this.router.navigate(['/aio/shared/capture-face']);
    //     break;
    //   }
    //   case ServiceStep.CaptureFace: {
    //     this.router.navigate(['/aio/shared/input-finger']);
    //     break;
    //   }
    //   case ServiceStep.InputFinger: {
    //     this.router.navigate(['/aio/shared/collect-card-id']);
    //     break;
    //   }
    //   case ServiceStep.CollectCardId: {
    //     this.router.navigate(['/aio/shared/input-mobile-number']);
    //     break;
    //   }
    //   case ServiceStep.InputMobileNumber: {
    //     this.router.navigate(['/aio/shared/verify-customer-info']);
    //     break;
    //   }
    //   case ServiceStep.VerifyCustomerInfo: {
    //     this.router.navigate(['/aio/on-boarding/fill-info']);
    //     break;
    //   }
    //   case ServiceStep.FillInfo: {
    //     this.router.navigate(['/aio/on-boarding/account-and-alert']);
    //     break;
    //   }
    //   case ServiceStep.AccountAndAlert: {
    //     this.router.navigate(['/aio/on-boarding/end']);
    //     break;
    //   }
    //   case ServiceStep.End: {
    //     this.router.navigate(['/aio']);
    //     break;
    //   }
    //   default: {
    //     this.router.navigate(['/aio']);
    //     break;
    //   }
    // }
  }
}
