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
    let x = setInterval(() => {
      this.aioSvc.loadImage().subscribe(
        (res: any) => {
          if (res.respCode == '00') {
            this.front = res.data.frontBase64;
            this.back = res.data.backBase64;
            clearInterval(x);
          }
        },
        (err) => {
          this.aioSvc.alert(`Có lỗi xảy ra loadImage`);
          clearInterval(x);
        }
      );
      console.log('Load image');
    }, 2000);
  }

  genQR() {
    this.qrValue =
      this.baseUrl +
      'aio/shared/mobile-capture-card-id/' +
      this.aioSvc.deviceID +
      '/' +
      this.aioSvc.sessionID;

    console.log(this.qrValue);
  }

  next() {
    this.compareFace();
  }

  compareFace() {
    this.aioSvc.isProcessing = true;
    this.aioSvc.uploadImage(this.aioSvc.faceCaptured, 'face').subscribe(
      (res: any) => {
        if (res.respCode == '00') {
          console.log('Upload face', res);
          this.aioSvc.compareFace().subscribe(
            (res: any) => {
              console.log('compareFace', res);
              if (res.respCode == '00') {
                if (res.data.result == '1') {
                  if (
                    res.data.customerOCRInfo.customerID ==
                    this.aioSvc.customerInfo.customerID
                  ) {
                    this.aioSvc
                      .uploadImage(this.aioSvc.faceCaptured, 'done')
                      .subscribe(
                        (res: any) => {
                          this.aioSvc.isProcessing = false;
                          if (res.respCode == '00') {
                            this.aioSvc.next();
                          } else {
                            this.aioSvc.alert(`Có lỗi xảy ra uploadImage-done`);
                          }
                        },
                        (err) => {
                          this.aioSvc.alert(`Có lỗi xảy ra uploadImage-done`);
                        }
                      );
                  } else {
                    this.aioSvc.alert(`Số CCCD không trùng khớp`);
                    this.aioSvc.isProcessing = false;
                  }
                  this.aioSvc.isProcessing = false;
                } else {
                  this.aioSvc.alert(`Xác thực thất bại`);
                  this.aioSvc.isProcessing = false;
                }
              } else {
                this.aioSvc.alert(`Có lỗi xảy ra compareFace`);
              }
            },
            (err) => {
              this.aioSvc.alert(`Có lỗi xảy ra compareFace`);
            }
          );
        } else {
          this.aioSvc.alert(`Có lỗi xảy ra uploadImage-face`);

          this.aioSvc.isProcessing = false;
        }
      },
      (err) => {
        this.aioSvc.alert(`Có lỗi xảy ra uploadImage-face`);

        this.aioSvc.isProcessing = false;
      }
    );
  }

  reUpload() {
    this.front = '';
    this.back = '';
  }
}
