import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { TestCase } from 'src/app/models/aio';
import { Service, ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/all-in-one/aio.service';
import { DashBoardService } from 'src/app/services/all-in-one/dash-board.service';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css'],
})
export class DashBoardComponent implements OnInit, AfterViewInit {
  service = Service;
  constructor(public aioSvc: AioService, private dbSvc: DashBoardService) {
    aioSvc.currentStep = ServiceStep.DashBoard;
    aioSvc.isProcessing = true;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.aioSvc.isProcessing = false;
  }

  startService(serviceCd: any) {
    this.aioSvc.currentSerice = serviceCd;
    console.log('serviceCd', serviceCd);

    this.dbSvc.getSessionId().subscribe(
      (result: any) => {
        if (result) {
          console.log(result);
          if (result.respCode != '00') {
            this.aioSvc.isProcessing = false;
            this.aioSvc.alert('Dịch vụ không thể thực hiện lúc này');
          } else {
            this.aioSvc.isProcessing = false;
            this.aioSvc.sessionID = result.data.sessionId;
            this.aioSvc.runIdle();

            //TODO: this is offical code
            // this.aioSvc.next();

            //TODO: remove hard for testing
            // Start hard
            let testCaseId = prompt('Nhập testCaseId');
            if (testCaseId != null) {
              console.log(
                '🚀 ~ file: dash-board.component.ts:63 ~ DashBoardComponent ~ startService ~ testCaseId:',
                testCaseId
              );
              this.aioSvc.fakeData(testCaseId);
            } else {
              this.aioSvc.alert('Troll ???');
            }

            // End hard
          }
        } else {
          this.aioSvc.alert('Dịch vụ không thể thực hiện lúc này');
          this.aioSvc.isProcessing = false;
        }
      },
      (err: any) => {
        this.aioSvc.isProcessing = false;
        this.aioSvc.alert('Dịch vụ không thể thực hiện lúc này');
      }
    );
  }

  slides = [
    {
      img: 'assets/all-in-one/shared/img/banner_aio_1.png',
    },
    {
      img: 'assets/all-in-one/shared/img/banner_aio_2.png',
    },
  ];

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    fade: true,
    cssEase: 'ease-out',
  };
}
