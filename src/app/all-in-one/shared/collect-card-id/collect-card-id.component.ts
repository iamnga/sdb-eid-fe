import { Component, OnInit, Inject } from '@angular/core';
import { ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/aio.service';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-collect-card-id',
  templateUrl: './collect-card-id.component.html',
  styleUrls: ['./collect-card-id.component.css'],
})
export class CollectCardIdComponent implements OnInit {
  qrValue = '';
  front = '';
  back = '';
  dots: AnimationOptions = {
    path: 'assets/all-in-one/shared/img/dots.json',
  };
  constructor(
    @Inject('BASE_URL') private baseUrl: string,
    private aioSvc: AioService
  ) {
    aioSvc.currentStep = ServiceStep.CollectCardId;
  }

  ngOnInit(): void {
    this.genQR();
    setInterval(() => {
      //Gọi cho BE để kiểm tra khách hàng đã upload ảnh lên chưa
      //Nếu đã up rồi thì hiển thị ảnh lên và chờ khách hàng xác nhận/chụp lại
      //Khi KH nhấn xác nhận thì gọi API check face
      console.log('Get card id image');
    }, 2000);
  }

  genQR() {
    this.qrValue =
      this.baseUrl +
      'collect/' +
      this.aioSvc.deviceID +
      '/' +
      this.aioSvc.sessionID;
  }

  next() {
    this.aioSvc.next();
  }
}
