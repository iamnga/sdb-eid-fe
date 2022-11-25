import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-collect-card-id',
  templateUrl: './collect-card-id.component.html',
  styleUrls: ['./collect-card-id.component.css'],
})
export class CollectCardIdComponent implements OnInit {
  qrValue = '';
  ssid: number;

  constructor(@Inject('BASE_URL') private baseUrl: string) {}

  ngOnInit(): void {
    this.genQR();
  }

  genQR() {
    this.ssid = new Date().getTime();
    this.qrValue = this.baseUrl + 'collect/' + this.ssid;
  }
}
