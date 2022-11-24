import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as faceapi from 'face-api.js';
@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.css'],
})
export class WebcamComponent implements OnInit {
  WIDTH = 640;
  HEIGHT = 360;
  face = '';
  @ViewChild('video', { static: true }) public video: ElementRef;
  @ViewChild('canvas', { static: true }) public canvasRef: ElementRef;
  constructor(private elRef: ElementRef, private zone: NgZone) {}
  stream: any;
  detection: any;
  resizedDetections: any;
  canvas: any;
  canvasEl: any;
  displaySize: any;
  videoInput: any;

  async ngOnInit() {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('../../assets/models'),
    ]).then(() => {
      this.startVideo();
    });
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

            clearInterval(x);
          }
        }, 100);
      });
  }
}
