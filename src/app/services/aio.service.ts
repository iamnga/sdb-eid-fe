import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Service, ServiceStep } from '../models/enum';

@Injectable({
  providedIn: 'root',
})
export class AioService {
  currentSerice = Service.None;
  currentStep = ServiceStep.Start;
  constructor(private router: Router) {}
  next() {
    if ((this.currentSerice = Service.OnBoarding)) {
      this.router.navigate(['/aio/on-boarding']);
    }
  }
}
