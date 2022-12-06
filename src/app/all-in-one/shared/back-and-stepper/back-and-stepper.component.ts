import { Component, OnInit, Input } from '@angular/core';
import { AioService } from 'src/app/services/aio.service';

@Component({
  selector: 'app-aio-back-and-stepper',
  templateUrl: './back-and-stepper.component.html',
  styleUrls: ['./back-and-stepper.component.css'],
})
export class BackAndStepperComponent implements OnInit {
  @Input() currentStep = 1;
  @Input() isShowStepper = true;
  steps: Stepper[] = [
    { stepNumber: 1, label: 'Chụp hình khuôn mặt' },
    { stepNumber: 2, label: 'Xác thực CCCD & vân tay' },
    { stepNumber: 3, label: 'Thu thập thông tin' },
    { stepNumber: 4, label: 'Tạo tài khoản' },
  ];

  stepLines = [...Array(this.steps.length * 2).keys()];

  constructor(private aioSvc: AioService) {}

  ngOnInit(): void {}

  goHome() {
    this.aioSvc.release();
  }
}

export class Stepper {
  stepNumber: number;
  label: string;
}
