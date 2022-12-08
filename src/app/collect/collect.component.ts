import { Component, Inject, OnInit } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AioService } from '../services/aio.service';

@Component({
  selector: 'app-collect',
  templateUrl: './collect.component.html',
})
export class CollectComponent implements OnInit {
  deviceID = '';
  sessionID = '';
  constructor(
    private sanitizer: DomSanitizer,
    private actRoute: ActivatedRoute,
    private aioSvc: AioService
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
  // image: string | SafeUrl;

  // fileChange(event: any) {
  //   this.image = this.sanitizer.bypassSecurityTrustUrl(
  //     window.URL.createObjectURL(event.target.files[0])
  //   );
  // }
}
