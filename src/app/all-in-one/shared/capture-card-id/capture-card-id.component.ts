import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/all-in-one/aio.service';

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
  width = 1920;
  height = 1080;

  constructor(
    public aioSvc: AioService
  ) {
    aioSvc.currentStep = ServiceStep.CaptureCardId;
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
          .getUserMedia({ video: { deviceId: videoDevices[0].deviceId, width: this.width, height: this.height }, audio: false })
          .then((stream) => {
            this.videoPreview.nativeElement.srcObject = stream;
          })
          .catch((err) => this.aioSvc.alertWithGoHome('Không tải được camera'));
      }
      else {
        this.aioSvc.alertWithGoHome('Không tải được camera')
      }

    } catch (error) {
      this.aioSvc.alertWithGoHome('Không tải được camera')
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
        console.log(videoEl.videoWidth + '-' + videoEl.videoHeight);
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
        this.aioSvc.alertWithGoHome('Không chụp được ảnh do trình duyệt không hỗ trợ')
      }
    } else {
      this.aioSvc.alertWithGoHome('Không chụp được ảnh do không tìm thấy canvas')
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
      this.aioSvc.next();
    }
  }

  previous() {
    this.step--;
    this.captured = true;
    this.back = '';
  }

}

