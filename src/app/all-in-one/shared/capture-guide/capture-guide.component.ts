import { Component, OnInit } from '@angular/core';
import { ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/aio.service';

@Component({
  selector: 'app-capture-guide',
  templateUrl: './capture-guide.component.html',
  styleUrls: ['./capture-guide.component.css'],
})
export class CaptureGuideComponent implements OnInit {
  constructor(private aioSvc: AioService) {
    aioSvc.currentStep = ServiceStep.CaptureGuide;
  }

  ngOnInit(): void {}

  next() {
    this.aioSvc.next();
  }
}
