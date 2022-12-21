import { Component, OnInit } from '@angular/core';
import { ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/aio.service';

@Component({
  selector: 'app-recheck-info',
  templateUrl: './recheck-info.component.html',
  styleUrls: ['./recheck-info.component.css'],
})
export class RecheckInfoComponent implements OnInit {
  constructor(public aioSvc: AioService) {
    this.aioSvc.currentStep = ServiceStep.RecheckInfo;
  }

  ngOnInit(): void {}

  confirm() {
    this.aioSvc.next();
  }
}
