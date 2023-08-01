import { Component } from '@angular/core';
import { AioService } from '../services/all-in-one/aio.service';
import { ServiceStep } from '../models/enum';

@Component({
  selector: 'app-all-in-one',
  templateUrl: './all-in-one.component.html',
  styleUrls: ['./all-in-one.component.css'],
})
export class AllInOneComponent {
  serviceStep = ServiceStep;
  constructor(public aioSvc: AioService) {
  }
}
