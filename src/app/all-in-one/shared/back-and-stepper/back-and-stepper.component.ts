import { Component, OnInit, Input } from '@angular/core';
import { Service } from 'src/app/models/enum';
import { AioService } from 'src/app/services/aio.service';

@Component({
  selector: 'app-aio-back-and-stepper',
  templateUrl: './back-and-stepper.component.html',
  styleUrls: ['./back-and-stepper.component.css'],
})
export class BackAndStepperComponent implements OnInit {
  @Input() currentStep = 1;
  @Input() isShowStepper = true;
  steps: Stepper[] = [];

  masterStepper: MasterStepper[] = [
    {
      service: Service.OnBoarding,
      steps: [
        { stepNumber: 1, label: 'Chụp hình khuôn mặt' },
        { stepNumber: 2, label: 'Xác thực CCCD & vân tay' },
        { stepNumber: 3, label: 'Thu thập thông tin' },
        { stepNumber: 4, label: 'Tạo tài khoản' },
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

  ngOnInit(): void {}

  goHome() {
    this.aioSvc.release();
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
