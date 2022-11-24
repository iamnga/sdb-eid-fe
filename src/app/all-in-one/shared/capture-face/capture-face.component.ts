import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as faceapi from 'face-api.js';

@Component({
  selector: 'app-capture-face',
  templateUrl: './capture-face.component.html',
  styleUrls: ['../../all-in-one.component.css', './capture-face.component.css'],
})
export class CaptureFaceComponent implements OnInit {
  isUnderstood = false;
  WIDTH = 640;
  HEIGHT = 0;
  face = '';
  @ViewChild('video', { static: true }) public video: ElementRef;
  @ViewChild('canvas', { static: true }) public canvasRef: ElementRef;
  constructor(private elRef: ElementRef, private router: Router) {}
  stream: any;
  detection: any;
  resizedDetections: any;
  canvas: any;
  canvasEl: any;
  displaySize: any;
  videoInput: any;
  countDownTime = 3; //second

  async ngOnInit() {
    localStorage.setItem('face-captured', '');
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
            canvases.length > 0
          ) {
            this.face = canvases[0].toDataURL('image/png');

            localStorage.setItem('face-captured', this.face);

            console.log('face-captured', this.face);

            this.HEIGHT = 0;

            clearInterval(x);

            this.router.navigate(['/aio/on-boarding/input-finger']);
          }
        }, 100);
      });
  }

  countdown() {
    this.HEIGHT = 0;
    var y = setInterval(async () => {
      this.countDownTime--;
      if (this.countDownTime == 0) {
        this.HEIGHT = 480; // Show video box
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('../../assets/models'),
        ]).then(() => {
          this.startVideo();
        });
        clearInterval(y);
      }
    }, 1000);
  }

  understood() {
    this.isUnderstood = true;
    this.countdown();
  }

  // doStore() {
  //   localStorage.setItem('customer-face', this.face);
  //   this._router.navigate(['/aio/on-boarding/input-finger']);
  // }
}
