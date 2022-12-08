import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AioService } from 'src/app/services/aio.service';

@Component({
  selector: 'app-mobile-capture-card-id',
  templateUrl: './mobile-capture-card-id.component.html',
  styleUrls: ['./mobile-capture-card-id.component.css'],
})
export class MobileCaptureCardIdComponent implements OnInit {
  step = 1;
  deviceID = '';
  sessionID = '';
  constructor(private actRoute: ActivatedRoute, private aioSvc: AioService) {
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

  next() {
    this.step++;
  }
}
