import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Service, ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/aio.service';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css'],
})
export class DashBoardComponent implements OnInit {
  service = Service;
  constructor(public aioSvc: AioService, private router: Router) {
    aioSvc.currentStep = ServiceStep.DashBoard;
  }

  ngOnInit(): void {}

  startService(serviceCd: any) {
    this.aioSvc.currentSerice = serviceCd;
    this.aioSvc.isProcessing = true;
    console.log('serviceCd', serviceCd);
    this.aioSvc.getSessionId().subscribe(
      (result: any) => {
        this.aioSvc.isProcessing = false;
        if (result) {
          console.log(result);
          if (result.respCode != '00') {
            this.aioSvc.alert(`Có lỗi xảy ra: ${result.respDescription}`);
          } else {
            this.aioSvc.sessionID = result.data.sessionId;
            if (serviceCd == this.service.OnBoarding)
              this.router.navigate(['/aio/on-boarding']);
          }
        } else {
          this.aioSvc.alert(`Có lỗi xảy ra: getSessionId`);
        }
      },
      (err) => {
        this.aioSvc.isProcessing = false;
        this.aioSvc.alert(`Có lỗi xảy ra: ${err}`);
      }
    );
  }

  slides = [
    {
      img: 'https://www.sacombank.com.vn/BannerHomeDK/283/Sacombank_ChienDich500kTheTD2022_PC.jpg',
    },
    {
      img: 'https://www.sacombank.com.vn/BannerHomeDK/283/Sacombank_OnlyOne_1920.jpg',
    },
    {
      img: 'https://www.sacombank.com.vn/BannerHomeDK/283/Sacombank_GiamHetCoSaleBatNgo_Web.jpg',
    },
    {
      img: 'https://www.sacombank.com.vn/BannerHomeDK/283/Sacombank_NapasCombo_BannerWeb.png',
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
