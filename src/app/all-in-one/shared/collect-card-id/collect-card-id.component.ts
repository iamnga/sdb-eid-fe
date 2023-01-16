import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ServiceStep } from 'src/app/models/enum';
import { AnimationOptions } from 'ngx-lottie';
import { AioService } from 'src/app/services/all-in-one/aio.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-collect-card-id',
  templateUrl: './collect-card-id.component.html',
  styleUrls: ['./collect-card-id.component.css'],
})
export class CollectCardIdComponent implements OnInit, OnDestroy {
  qrValue = '';
  dots: AnimationOptions = {
    path: 'assets/all-in-one/shared/img/dots.json',
  };
  loadImageInterval: any;

  constructor(
    @Inject('BASE_URL') private baseUrl: string,
    public aioSvc: AioService
  ) {
    aioSvc.currentStep = ServiceStep.CollectCardId;
  }

  ngOnInit(): void {
    this.genQR();
    this.loadImageInterval = setInterval(() => {
      this.aioSvc.loadImage().subscribe(
        (res: any) => {
          if (res.respCode == '00') {
            this.aioSvc.frontCardId = res.data.frontBase64;
            this.aioSvc.backCardId = res.data.backBase64;
            clearInterval(this.loadImageInterval);
          }
        },
        (err) => {
          this.aioSvc.alert(`Có lỗi xảy ra loadImage`);
          clearInterval(this.loadImageInterval);
        }
      );
      console.log('Load image');
    }, 2000);
  }

  genQR() {
    this.qrValue =
      environment.uploadCardIdUrl +
      'upload/' +
      this.aioSvc.deviceID +
      '/' +
      this.aioSvc.sessionID;

    console.log(this.qrValue);
  }

  next() {
    this.compareFace();
  }

  compareFace() {
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
                          if (res.respCode == '00') {
                            this.aioSvc.next();
                          } else {
                            this.aioSvc.alert(`Có lỗi xảy ra uploadImage-done`);
                            this.aioSvc.isProcessing = false;
                          }
                        },
                        (err) => {
                          this.aioSvc.alert(`Có lỗi xảy ra uploadImage-done`);
                          this.aioSvc.isProcessing = false;
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
              this.aioSvc.isProcessing = false;
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
    this.aioSvc.frontCardId = '';
    this.aioSvc.backCardId = '';
  }

  ngOnDestroy() {
    clearInterval(this.loadImageInterval);
  }
}
