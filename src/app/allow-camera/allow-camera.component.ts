import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-allow-camera',
  templateUrl: './allow-camera.component.html',
  styleUrls: ['./allow-camera.component.scss'],
})
export class AllowCameraComponent implements OnInit {
  constructor() {}
  cameraStream: MediaStream | undefined;
  cameras: MediaDeviceInfo[] = [];

  async ngOnInit() {
    this.cameras = await this.getAvailableCameras();
  }

  async getAvailableCameras(): Promise<MediaDeviceInfo[]> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === 'videoinput');
  }

  async requestCameraAccess() {
    try {
      if (this.cameras.length === 0) {
        this.cameras = await this.getAvailableCameras();
      }

      if (this.cameras.length > 0) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: this.cameras[0].deviceId } });
        this.cameraStream = stream;
        const videoElement: HTMLVideoElement | null = document.querySelector('video');
        if (videoElement) {
          videoElement.srcObject = stream;
        }
      } else {
        console.error('Không có camera nào được tìm thấy.');
      }
    } catch (error) {
      console.error('Không thể truy cập Camera:', error);
    }
  }

  async selectCamera(event: any) {
    const target = event.target as HTMLSelectElement;
    const deviceId = target.value;
    if (!deviceId) {
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: deviceId } });
      this.cameraStream = stream;
      const videoElement: HTMLVideoElement | null = document.querySelector('video');
      if (videoElement) {
        videoElement.srcObject = stream;
      }
    } catch (error) {
      console.error('Không thể chọn camera:', error);
    }
  }
}
