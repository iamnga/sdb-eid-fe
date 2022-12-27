import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as faceapi from 'face-api.js';
import { ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/aio.service';
import { Subscription } from 'rxjs';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-capture-face',
  templateUrl: './capture-face.component.html',
  styleUrls: ['../../all-in-one.component.css', './capture-face.component.css'],
})
export class CaptureFaceComponent implements OnInit, OnDestroy {
  faceLoad: AnimationOptions = {
    path: 'assets/all-in-one/shared/img/face-load.json',
  };
  isUnderstood = true;
  WIDTH = 640;
  HEIGHT = 480;
  @ViewChild('video', { static: true }) public video: ElementRef;
  @ViewChild('canvas', { static: true }) public canvasRef: ElementRef;
  constructor(private elRef: ElementRef, private aioSvc: AioService) {
    aioSvc.currentStep = ServiceStep.CaptureFace;
  }
  resultDetection: any;
  resizedDetections: any;
  canvas: any;
  canvasEl: any;
  displaySize: any;
  videoInput: any;
  countDownTime = 4; //second
  endCountDown = false;
  isLoadingCountDown = true;
  captured = '';
  isReadyDetect = false;

  subscription: Subscription;

  ngOnInit() {
    this.aioSvc.faceCaptured = '';
    this.startCapture();
  }

  prepareFaceDetector() {
    let base_image = new Image();
    base_image.src = 'assets/all-in-one/shared/img/startDetectFace.jpeg';
    let self = this;

    base_image.onload = function () {
      const fullFaceDescription = faceapi
        .detectAllFaces(
          base_image,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 608,
            scoreThreshold: 0.7,
          })
        )
        .run()
        .then((res) => {
          console.log('--------> ' + JSON.stringify(res));
          self.startVideo();
        });
    };
  }

  async startVideo() {
    this.videoInput = this.video.nativeElement;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        this.video.nativeElement.srcObject = stream;
      })
      .catch((err) => console.error(err));

    await this.detect_Faces();
  }

  async detect_Faces() {
    this.elRef.nativeElement
      .querySelector('video')
      .addEventListener('play', async () => {
        this.canvas = await faceapi.createCanvasFromMedia(this.videoInput);
        this.doDetect();
      });
  }

  doDetect() {
    this.displaySize = {
      width: this.WIDTH,
      height: this.HEIGHT,
    };
    faceapi.matchDimensions(this.canvas, this.displaySize);

    this.countdown();

    setTimeout(() => {
      var x = setInterval(async () => {
        console.log('run detect: ', x);

        this.resultDetection = await faceapi.detectSingleFace(
          this.videoInput,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 608,
            scoreThreshold: 0.7,
          })
        );

        if (this.resultDetection && this.captured == '') {
          let box = this.resultDetection.box;

          if (
            box.x >= 170 &&
            box.y >= 90 &&
            box.width + box.x <= 470 &&
            box.height + box.y <= 390 &&
            box.width >= 150
          ) {
            let canvasFaceBox = await faceapi.extractFaces(this.videoInput, [
              new faceapi.Rect(120, 0, 400, this.HEIGHT),
            ]);

            console.log(
              'canvasFaceBox',
              canvasFaceBox[0].toDataURL('image/png')
            );

            this.aioSvc.faceCaptured = canvasFaceBox[0].toDataURL('image/png');

            let canvasFullBox = await faceapi.extractFaces(this.videoInput, [
              new faceapi.Rect(0, 0, this.WIDTH, this.HEIGHT),
            ]);

            console.log(
              'canvasFullBox',
              canvasFullBox[0].toDataURL('image/png')
            );

            this.captured = canvasFullBox[0].toDataURL('image/png');

            console.log('inside face loader: ', this.resultDetection);

            clearInterval(x);
          } else {
            // console.log('outside face loader: ', this.detection);
          }
        }
      }, 100);
    }, 4000);
  }

  countdown() {
    console.log(2);
    let cdInterval = setInterval(() => {
      this.isReadyDetect = true;
      console.log('countDownTime', this.countDownTime);
      this.isLoadingCountDown = false;
      this.countDownTime = this.countDownTime - 1;
      if (this.countDownTime == 0) {
        this.endCountDown = true;
        clearInterval(cdInterval);
      }
    }, 1000);
  }

  understood() {
    this.isUnderstood = true;
  }

  reCapture() {
    this.countDownTime = 4;
    this.endCountDown = false;
    this.isLoadingCountDown = true;
    this.captured = '';
    this.aioSvc.faceCaptured = '';
    this.doDetect();
  }

  async startCapture() {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('assets/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('assets/models'),
    ]).then(() => {
      this.prepareFaceDetector();
    });
  }

  next() {
    this.aioSvc.next();
  }

  async getBase64ImageFromUrl(imageUrl: any) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();

    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.addEventListener(
        'load',
        function () {
          resolve(reader.result);
        },
        false
      );

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    });
  }

  ngOnDestroy() {
    let mediaStream = this.video.nativeElement.srcObject;

    if (mediaStream) {
      let tracks = mediaStream.getTracks();

      console.log(tracks.length);

      tracks[0].stop();
    }
  }
}
