import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Service, ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/all-in-one/aio.service';
import { DashBoardService } from 'src/app/services/all-in-one/dash-board.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css'],
})
export class DashBoardComponent implements OnInit, AfterViewInit {
  service = Service;
  constructor(
    public aioSvc: AioService,
    private dbSvc: DashBoardService,
    private router: Router
  ) {
    aioSvc.currentStep = ServiceStep.DashBoard;
    aioSvc.isProcessing = true;
  }

  ngOnInit(): void {
    // this.aioSvc.testHS()
  }

  ngAfterViewInit(): void {
    this.aioSvc.isProcessing = false;
  }

  startService(serviceCd: any) {
    this.aioSvc.currentSerice = serviceCd;
    console.log('serviceCd', serviceCd);
    //TODO Clear test
    if (this.aioSvc.currentSerice === Service.TestMk) {
      this.aioSvc.next();
    } else {
      this.dbSvc.getSessionId().subscribe(
        (result: any) => {
          if (result) {
            console.log(result);
            if (result.respCode != '00') {
              this.aioSvc.isProcessing = false;
              this.aioSvc.alert(`Có lỗi xảy ra: ${result.respDescription}`);
            } else {
              this.aioSvc.isProcessing = false;
              this.aioSvc.sessionID = result.data.sessionId;
              this.aioSvc.runIdle();
              this.aioSvc.next();
            }
          } else {
            this.aioSvc.alert(`Có lỗi xảy ra: ${result.respDescription}`);
            this.aioSvc.isProcessing = false;
          }
        },
        (err: any) => {
          this.aioSvc.isProcessing = false;
          this.aioSvc.alert(`Có lỗi xảy ra`);
        }
      );
    }
  }

  slides = [
    {
      img: 'assets/all-in-one/shared/img/banner_aio_1.png',
    },
    {
      img: 'assets/all-in-one/shared/img/banner_aio_2.png',
    }
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
