import { Component, Input } from '@angular/core';
import { Service } from 'src/app/models/enum';
import { AioService } from 'src/app/services/all-in-one/aio.service';

@Component({
  selector: 'app-aio-back-and-stepper',
  templateUrl: './back-and-stepper.component.html',
  styleUrls: ['./back-and-stepper.component.css'],
})
export class BackAndStepperComponent {
  @Input() currentStep = 1;
  @Input() isShowStepper = true;
  steps: Stepper[] = [];

  masterStepper: MasterStepper[] = [
    {
      service: Service.OnBoarding,
      steps: [
        { stepNumber: 1, label: 'Scan CCCD' },
        { stepNumber: 2, label: 'Thu thập thông tin' },
        { stepNumber: 3, label: 'Mở tài khoản' },
        { stepNumber: 4, label: 'Xác thực' },
        { stepNumber: 5, label: 'Hoàn tất' },
      ],
    },

    {
      service: Service.UpdateCardId,
      steps: [
        { stepNumber: 1, label: 'Xác minh nhân dạng' },
        { stepNumber: 2, label: 'Xác thực thông tin' },
        { stepNumber: 3, label: 'Nhập mã OTP' },
      ],
    },
  ];

  length = 0;

  stepLines: any;

  constructor(private aioSvc: AioService) {
    // TODO: Remove hard currentSerice
    this.aioSvc.currentSerice = Service.OnBoarding
    let index = this.masterStepper.findIndex(
      (x) => x.service == this.aioSvc.currentSerice
    );

    if (index > -1) {
      this.stepLines = [
        ...Array(this.masterStepper[index].steps.length * 2).keys(),
      ];
      this.steps = this.masterStepper[index].steps;
    }
  }

}
export class MasterStepper {
  service: Service;
  steps: Stepper[];
}

export class Stepper {
  stepNumber: number;
  label: string;
}
