import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AllInOneResponse, GetSessionIdResponseData } from 'src/app/models/aio';
import { Service, ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/aio.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-on-boarding',
  templateUrl: './on-boarding.component.html',
  styleUrls: ['./on-boarding.component.css'],
})
export class OnBoardingComponent implements OnInit {
  constructor(private router: Router, private aioSvc: AioService) {
    aioSvc.currentSerice = Service.OnBoarding;
  }

  ngOnInit(): void {}
}
