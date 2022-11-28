import { Component, OnInit } from '@angular/core';
import { ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/aio.service';

@Component({
  selector: 'app-input-mobile-number',
  templateUrl: './input-mobile-number.component.html',
  styleUrls: [
    '../../all-in-one.component.css',
    './input-mobile-number.component.css',
  ],
})
export class InputMobileNumberComponent implements OnInit {
  constructor(private aioService: AioService) {
    aioService.currentStep = ServiceStep.InputMobileNumber;
  }

  ngOnInit(): void {}

  next() {
    this.aioService.next();
  }
}
