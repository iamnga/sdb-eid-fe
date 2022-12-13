import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AioService } from 'src/app/services/aio.service';

@Component({
  selector: 'app-mobile-capture-card-id',
  templateUrl: './mobile-capture-card-id.component.html',
  styleUrls: ['./mobile-capture-card-id.component.css'],
})
export class MobileCaptureCardIdComponent implements OnInit {
  step = 2;
  deviceID = '';
  sessionID = '';
  front: string | SafeUrl;
  back: string | SafeUrl;

  constructor(
    private actRoute: ActivatedRoute,
    private aioSvc: AioService,
    private sanitizer: DomSanitizer
  ) {
    this.deviceID = this.actRoute.snapshot.params['deviceid'];
    this.sessionID = this.actRoute.snapshot.params['sessionid'];
  }

  ngOnInit() {
    this.aioSvc.verifySessionID(this.deviceID, this.sessionID).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {}
    );
  }

  fileChange(event: any, side: string) {
    if (side == 'front') {
      this.front = this.sanitizer.bypassSecurityTrustUrl(
        window.URL.createObjectURL(event.target.files[0])
      );
    } else {
      this.back = this.sanitizer.bypassSecurityTrustUrl(
        window.URL.createObjectURL(event.target.files[0])
      );
    }
  }

  next() {
    this.step++;
  }
}
