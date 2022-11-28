import { Component, OnInit } from '@angular/core';
import { ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/aio.service';

@Component({
  selector: 'app-fill-info',
  templateUrl: './fill-info.component.html',
  styleUrls: ['./fill-info.component.css'],
})
export class FillInfoComponent implements OnInit {
  constructor(private aioSvc: AioService) {
    aioSvc.currentStep = ServiceStep.FillInfo;
  }

  ngOnInit(): void {}

  confirm() {
    this.aioSvc.next();
  }
}
