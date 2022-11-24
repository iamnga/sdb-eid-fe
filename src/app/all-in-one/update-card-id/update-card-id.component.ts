import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-update-card-id',
  templateUrl: './update-card-id.component.html',
  styleUrls: ['./update-card-id.component.css'],
})
export class UpdateCardIdComponent implements OnInit {
  ssid = '';
  constructor() {}

  ngOnInit(): void {
    this.ssid = new Date().getTime().toString();
    localStorage.setItem('aio-ssid', this.ssid);
    localStorage.setItem('cs', '2'); // Current service - 1: on boarding, 2:  update cus info
  }
}
