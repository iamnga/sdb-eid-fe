import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ServiceStep } from 'src/app/models/enum';
import { AnimationOptions } from 'ngx-lottie';
import { AioService } from 'src/app/services/all-in-one/aio.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-capture-card-id',
  templateUrl: './capture-card-id.component.html',
  styleUrls: ['./capture-card-id.component.css', '../../all-in-one.component.css'],
})
export class CaptureCardIdComponent implements OnInit {


  @ViewChild('videoPreview', { static: false }) videoPreview: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  videoStream: MediaStream;
  captured: boolean = false;
  step = 1 // Step 1 = Front; Step 2 = Back
  front = '';
  back = '';

  constructor(
    public aioSvc: AioService
  ) {
    aioSvc.currentStep = ServiceStep.CollectCardId;
  }

  ngOnInit() {
    this.startCamera();
  }

  // Hàm bắt đầu chụp ảnh từ camera
  async startCamera() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      console.log(devices)
      const videoDevices = devices.filter(x => x.kind === "videoinput");
      console.log(videoDevices)
      if (videoDevices.length > 1) {
        navigator.mediaDevices
          .getUserMedia({ video: { deviceId: videoDevices[0].deviceId }, audio: false })
          .then((stream) => {
            this.videoPreview.nativeElement.srcObject = stream;
          })
          .catch((err) => console.error(err));
      }
      else {
        alert('Không tồn tại 2 camera')
      }

    } catch (error) {
      console.error('Lỗi khi lấy danh sách camera:', error);
    }
  }

  // Hàm chụp ảnh và hiển thị lên canvas
  takePicture() {
    console.log(this.step)
    const videoEl: HTMLVideoElement = this.videoPreview.nativeElement;
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;

    if (canvasEl) {
      const ctx = canvasEl.getContext('2d');
      if (ctx) {
        canvasEl.width = videoEl.videoWidth;
        canvasEl.height = videoEl.videoHeight;
        ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);
        this.captured = true;

        if (this.step === 1) {
          this.front = canvasEl.toDataURL('image/jpeg');
        }
        else {
          this.back = canvasEl.toDataURL('image/jpeg');
        }

      } else {
        console.error('getContext 2D không được hỗ trợ trong trình duyệt này.');
      }
    } else {
      console.error('Không tìm thấy canvas element.');
    }
  }


  // Hàm cho phép chụp lại ảnh từ camera
  retryPicture() {
    if (this.step === 1) {
      this.front = ''
    }
    else {
      this.back = ''
    }
    this.captured = false;
  }

  next() {
    if (this.step === 1) {
      this.step++;
      this.captured = false;
    }
    else {
      console.log('front: ', this.front)
      console.log('back: ', this.back)
      this.aioSvc.frontCardId = this.front;
      this.aioSvc.backCardId = this.back;
      this.compareFace();
    }
  }

  compareFace() {
    this.aioSvc
      .uploadImage(this.front, 'front')
      .subscribe(
        (res: any) => {
          if (res.respCode == '00') {
            console.log('Upload front', res);

            this.aioSvc
              .uploadImage(
                this.back,
                'back'
              )
              .subscribe(
                (res: any) => {
                  if (res.respCode == '00') {
                    console.log('Upload back', res);
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
                                  this.aioSvc.alert(`Xác thực thất bại, Quý khách vui lòng thử lại`, false);
                                  this.aioSvc.isProcessing = false;
                                }
                              } else {
                                this.aioSvc.alert(`Có lỗi xảy ra, Quý khách vui lòng thử lại`, false);
                                this.aioSvc.isProcessing = false;
                              }
                            },
                            (err) => {
                              this.aioSvc.alert(`Có lỗi xảy ra`);
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
                  } else {
                    // this.alert(`Có lỗi xảy ra uploadImage-back`);

                    this.aioSvc.isProcessing = false;
                    return;
                  }
                },
                (err) => {
                  // this.alert(`Có lỗi xảy ra uploadImage-back`);
                  console.log(err);
                  this.aioSvc.isProcessing = false;
                  return;
                }
              );
          } else {
            // this.alert(`Có lỗi xảy ra uploadImage-Front`);

            this.aioSvc.isProcessing = false;
            return;
          }
        },
        (err) => {
          // this.alert(`Có lỗi xảy ra uploadImage-Front`);
          console.log(err);
          this.aioSvc.isProcessing = false;
          return;
        }
      );




  }


  previous() {
    this.step--;
    this.captured = true;
    this.back = '';
  }

}

