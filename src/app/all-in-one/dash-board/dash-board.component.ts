import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css'],
})
export class DashBoardComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

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
