import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WebsocketService } from '../services/websocket.service';
import { BankData, FingerResponse, ReadCardRequest } from '../models/mk';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  qrValue = '';
  ssid = 0;
  checking = false;
  faceHash: any;
  step = 1;

  //Step 3 -Face
  WIDTH = 640 / 2;
  HEIGHT = 480 / 2;
  typeCheck = 'face';

  @ViewChild('video', { static: false })
  public video: ElementRef;

  @ViewChild('canvas', { static: false })
  public canvas: ElementRef;

  captures = '';
  error: any;
  isCaptured: boolean;

  //Step 3 - FingerPrint
  fpResponse: FingerResponse = new FingerResponse();

  //Step 2

  getFaceInterval = setInterval(() => {
    if (!this.checking && this.ssid > 0) this.getFace();
  }, 1000);

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string
  ) {
    // WebsocketService.messages.subscribe((msg) => {
    //   console.log('Response from websocket: ' + msg);
    // });
  }

  ngOnInit() {
    this.resetQR();
    console.log(this.qrValue);
  }

  resetQR() {
    this.ssid = new Date().getTime();
    this.qrValue = this.baseUrl + 'collect/' + this.ssid;
  }

  getFace() {
    // this.checking = true;
    // const headers = new HttpHeaders().set(
    //   'Content-Type',
    //   'text/plain; charset=utf-8'
    // );
    // this.http
    //   .get<any>(this.baseUrl + 'api/face/' + this.ssid, {
    //     headers,
    //     responseType: 'json',
    //   })
    //   .subscribe(
    //     (result) => {
    //       console.log(result);
    //       if (result.faceHash) {
    //         this.faceHash = 'data:image/png;base64,' + result.faceHash;
    //         this.stopInterval();
    //         this.checking = false;
    //       } else {
    //         console.log(
    //           'https://localhost:44322/camera/' +
    //             this.ssid +
    //             ' - chưa có dữ liệu'
    //         );
    //         this.checking = false;
    //       }
    //     },
    //     (error) => console.error(error)
    //   );
  }

  stopInterval() {
    clearInterval(this.getFaceInterval);
  }

  async next() {
    this.step++;
    if (this.step == 3) {
      if (this.typeCheck == 'face') await this.setupDevices();
      else this.callMkFingerPrint();
    }
    if (this.step == 4) {
      if (this.typeCheck == 'face') {
      }
    }
  }

  //Step 3 - Face

  onItemChange(event: any) {
    this.typeCheck = event.target.value;
  }

  async setupDevices() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (stream) {
          this.video.nativeElement.srcObject = stream;
          this.video.nativeElement.play();
          this.error = null;
        } else {
          this.error = 'You have no output video device';
        }
      } catch (e) {
        this.error = e;
      }
    }
  }

  capture() {
    this.drawImageToCanvas(this.video.nativeElement);
    this.captures = this.canvas.nativeElement.toDataURL('image/png');
    this.isCaptured = true;
  }

  removeCurrent() {
    this.isCaptured = false;
  }

  setPhoto(idx: number) {
    this.isCaptured = true;
    var image = new Image();
    image.src = this.captures[idx];
    this.drawImageToCanvas(image);
  }

  drawImageToCanvas(image: any) {
    this.canvas.nativeElement
      .getContext('2d')
      .drawImage(image, 0, 0, this.WIDTH, this.HEIGHT);
  }

  callMkCaptureFace() {
    let req = new ReadCardRequest();
    req.image = this.captures.split(',')[1];
    let bankData = new BankData();
    bankData.bankAppId = 1;
    bankData.bankTransactionId = '12321311312312';
    bankData.extendedInfo = '';
    bankData.transactionCode = 123123;

    req.bankData = bankData;
    const headers = new HttpHeaders().set(
      'Content-Type',
      'text/plain; charset=utf-8'
    );
    this.http
      .post('http://localhost:7171/moc/faceicao', req, { headers: headers })
      .subscribe(
        (res: any) => {
          this.fpResponse = res;
          console.log(this.fpResponse);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  //Step 3 - FingerPrint
  callMkFingerPrint() {
    let websocketService = new WebsocketService();
    websocketService.messages.subscribe((msg) => {
      this.fpResponse = msg;

      console.log(this.fpResponse);
      this.fpResponse.image = 'data:image/png;base64,' + this.fpResponse.image;
      console.log('Response from websocket: ' + this.fpResponse.verifyResponse);
    });
  }

  recallMkFingerPrint() {
    this.fpResponse = new FingerResponse();
    this.callMkFingerPrint();
  }
}
