import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AddressInfo,
  CustomerEnroll,
  CustomerInfo,
  RegisterAlert,
} from 'src/app/models/aio';
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
            this.customerEnroll();
            // this.aioSvc.next();
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

  customerEnroll() {
    let data = new CustomerEnroll();
    data.branchCode = 'VN001';
    data.accountCurrency = '704';
    data.accountType = 'R';

    let cusInfo = new CustomerInfo();
    cusInfo.address = '268 Nam Ky Khoi Nghia';
    cusInfo.categoryCustomer = 'N';
    cusInfo.country = 'VN';
    cusInfo.customerID = '352229666';
    cusInfo.customerType = '1';
    cusInfo.dob = '19950125';
    cusInfo.email = 'minhngaag@gmail.com';
    cusInfo.expireDate = '20340916';
    cusInfo.issueDate = '20180909';
    cusInfo.fullName = 'NGUYEN VAN A';
    cusInfo.gender = 'M';
    cusInfo.jobCode = '51';
    cusInfo.mobileNo = '0349444444';
    cusInfo.nationality = 'Viet Nam';
    cusInfo.towncountry = 'Nam Ky Khoi Nghia';
    cusInfo.issuePlace = 'CTCCSQLHCVTTXH';

    let residentialAddress = new AddressInfo();
    residentialAddress.provinceCode = '5000';
    residentialAddress.provinceName = 'Thanh pho Ho chi Minh';
    residentialAddress.districtCode = '5014';
    residentialAddress.districtName = 'Quan Tan Phu';
    residentialAddress.wardCode = '27010';
    residentialAddress.wardName = 'Phuong Tan Son Nhi';
    residentialAddress.street = '28 Tan Son Nhi';

    cusInfo.residentialAddress = residentialAddress;
    cusInfo.contactAddress = residentialAddress;
    data.customerInfo = cusInfo;

    let registerAlert = new RegisterAlert();
    registerAlert.methodAlert = 'P';

    data.registerAlert = registerAlert;

    this.aioSvc.customerEnroll(data).subscribe((res) => {
      console.log(res);
    });
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
