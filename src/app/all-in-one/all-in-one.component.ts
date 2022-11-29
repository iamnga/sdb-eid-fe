import { Component, OnInit } from '@angular/core';
import { ServiceStep } from '../models/enum';
import { AioService } from '../services/aio.service';

@Component({
  selector: 'app-all-in-one',
  templateUrl: './all-in-one.component.html',
  styleUrls: ['./all-in-one.component.css'],
})
export class AllInOneComponent implements OnInit {
  constructor(private aioSvc: AioService) {
    aioSvc.currentStep = ServiceStep.DashBoard;
  }

  ngOnInit(): void {}
}
