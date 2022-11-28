import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import * as faceapi from 'face-api.js';
import { ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/aio.service';

@Component({
  selector: 'app-capture-face',
  templateUrl: './capture-face.component.html',
  styleUrls: ['../../all-in-one.component.css', './capture-face.component.css'],
})
export class CaptureFaceComponent implements OnInit, AfterViewInit {
  isUnderstood = true;
  WIDTH = 640;
  HEIGHT = 480;
  face = '';
  @ViewChild('video', { static: true }) public video: ElementRef;
  @ViewChild('canvas', { static: true }) public canvasRef: ElementRef;
  constructor(private elRef: ElementRef, private aioSvc: AioService) {
    aioSvc.currentStep = ServiceStep.CaptureFace;
  }
  stream: any;
  detection: any;
  resizedDetections: any;
  canvas: any;
  canvasEl: any;
  displaySize: any;
  videoInput: any;
  countDownTime = 4; //second
  endCountDown = false;
  isLoadingCountDown = true;

  async ngOnInit() {
    localStorage.setItem('face-captured', '');
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('../../assets/models'),
    ]).then(() => {
      this.startVideo();
    });
  }

  ngAfterViewInit() {
    // this.countdown();
  }

  startVideo() {
    this.videoInput = this.video.nativeElement;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        this.video.nativeElement.srcObject = stream;
      })
      .catch((err) => console.error(err));

    this.detect_Faces();
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
        this.displaySize = {
          width: this.WIDTH,
          height: this.HEIGHT,
        };
        faceapi.matchDimensions(this.canvas, this.displaySize);

        this.countdown();

        var x = setInterval(async () => {
          this.detection = await faceapi.detectAllFaces(
            this.videoInput,
            new faceapi.TinyFaceDetectorOptions({
              scoreThreshold: 0.8,
            })
          );

          const canvases = await faceapi.extractFaces(
            this.videoInput,
            this.detection
          );

          if (
            this.detection.length > 0 &&
            this.face == '' &&
            canvases.length > 0 &&
            this.endCountDown
          ) {
            this.face = canvases[0].toDataURL('image/png');

            localStorage.setItem('face-captured', this.face);

            console.log('face-captured', this.face);

            const mediaStream = this.video.nativeElement.srcObject;

            const tracks = mediaStream.getTracks();

            tracks[0].stop();

            clearInterval(x);

            this.aioSvc.next();
          }
        }, 100);
      });
  }

  countdown() {
    var y = setInterval(() => {
      this.isLoadingCountDown = false;
      this.countDownTime = this.countDownTime - 1;
      console.log(this.countDownTime);
      if (this.countDownTime == 0) {
        this.endCountDown = true;
        clearInterval(y);
      }
    }, 1000);
  }

  understood() {
    this.isUnderstood = true;
    this.countdown();
  }

  stopVideo() {
    this.elRef.nativeElement.querySelector('video')[0].pause();
    this.elRef.nativeElement.querySelector('video')[0].source = '';
  }
}
