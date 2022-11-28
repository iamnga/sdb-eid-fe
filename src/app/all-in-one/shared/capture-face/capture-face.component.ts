import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as faceapi from 'face-api.js';
import { ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/aio.service';
import { interval, Subscription } from 'rxjs';
@Component({
  selector: 'app-capture-face',
  templateUrl: './capture-face.component.html',
  styleUrls: ['../../all-in-one.component.css', './capture-face.component.css'],
})
export class CaptureFaceComponent implements OnInit {
  isUnderstood = true;
  WIDTH = 640;
  HEIGHT = 480;
  @ViewChild('video', { static: true }) public video: ElementRef;
  @ViewChild('canvas', { static: true }) public canvasRef: ElementRef;
  constructor(private elRef: ElementRef, private aioSvc: AioService) {
    aioSvc.currentStep = ServiceStep.CaptureFace;
  }
  detection: any;
  resizedDetections: any;
  canvas: any;
  canvasEl: any;
  displaySize: any;
  videoInput: any;
  countDownTime = 4; //second
  endCountDown = false;
  isLoadingCountDown = true;
  captured = '';

  subscription: Subscription;

  ngOnInit() {
    localStorage.setItem('face-captured', '');
    this.startCapture();
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
        this.canvasEl = this.canvasRef.nativeElement;
        this.canvasEl.appendChild(this.canvas);
        this.canvas.setAttribute('id', 'canvass');
        this.canvas.setAttribute(
          'style',
          `position: fixed;
          top: 0;
          left: 0;`
        );

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

    var x = setInterval(async () => {
      console.log('run detect: ', x);
      this.detection = await faceapi.detectAllFaces(
        this.videoInput,
        new faceapi.TinyFaceDetectorOptions({
          scoreThreshold: 0.8,
        })
      );

      let canvases = await faceapi.extractFaces(
        this.videoInput,
        this.detection
      );

      let regionsToExtract = [new faceapi.Rect(0, 0, this.WIDTH, this.HEIGHT)];

      let canvases2 = await faceapi.extractFaces(
        this.videoInput,
        regionsToExtract
      );

      if (
        this.detection.length > 0 &&
        canvases.length > 0 &&
        this.endCountDown &&
        this.captured == ''
      ) {
        this.captured = canvases[0].toDataURL('image/png');

        localStorage.setItem('face-captured', this.captured);

        console.log('face-captured', this.captured);

        console.log('rect', canvases2[0].toDataURL('image/png'));

        this.captured = canvases2[0].toDataURL('image/png');

        clearInterval(x);
      }
    }, 100);
  }

  countdown() {
    console.log(2);
    let cdInterval = setInterval(() => {
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
    this.doDetect();
  }

  async startCapture() {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('../../assets/models'),
    ]).then(() => {
      this.startVideo();
    });
  }

  next() {
    let mediaStream = this.video.nativeElement.srcObject;

    let tracks = mediaStream.getTracks();

    console.log(tracks.length);

    tracks[0].stop();
    this.aioSvc.next();
  }
}
