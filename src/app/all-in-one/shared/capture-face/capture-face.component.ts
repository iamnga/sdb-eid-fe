import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-capture-face',
  templateUrl: './capture-face.component.html',
  styleUrls: ['../../all-in-one.component.css', './capture-face.component.css'],
})
export class CaptureFaceComponent implements OnInit {
  faceHash: any;
  WIDTH = 557;
  HEIGHT = 420;
  typeCheck = 'face';

  @ViewChild('video', { static: false })
  public video: ElementRef;

  @ViewChild('canvas', { static: false })
  public canvas: ElementRef;

  captures = '';
  error: any;
  isCaptured: boolean;

  constructor() {}

  ngOnInit(): void {
    this.setupDevices();
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
    if (this.isCaptured) {
      this.isCaptured = false;
    } else {
      this.drawImageToCanvas(this.video.nativeElement);
      this.captures = this.canvas.nativeElement.toDataURL('image/png');
      this.isCaptured = true;
    }
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
}
