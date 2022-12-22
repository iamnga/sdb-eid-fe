import { Component, OnInit } from '@angular/core';
import { ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/aio.service';

@Component({
  selector: 'app-end',
  templateUrl: './end.component.html',
  styleUrls: ['./end.component.css'],
})
export class EndComponent implements OnInit {
  constructor(public aioSvc: AioService) {
    aioSvc.currentStep = ServiceStep.End;
  }

  ngOnInit(): void {}

  confirm() {
    this.aioSvc.release();
  }
}
