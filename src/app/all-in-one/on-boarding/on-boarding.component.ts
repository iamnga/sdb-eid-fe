import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-on-boarding',
  templateUrl: './on-boarding.component.html',
  styleUrls: ['./on-boarding.component.css'],
})
export class OnBoardingComponent implements OnInit {
  ssid = '';
  constructor() {}

  ngOnInit(): void {
    this.ssid = new Date().getTime().toString();
    localStorage.setItem('aio-ssid', this.ssid);
    localStorage.setItem('cs', '1'); // Current service - 1: on boarding, 2:  update cus info
  }
}
