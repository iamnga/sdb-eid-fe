import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-input-card-id',
  templateUrl: './input-card-id.component.html',
  styleUrls: ['./input-card-id.component.css'],
})
export class InputCardIdComponent implements OnInit {
  ssid: string;
  constructor() {}

  ngOnInit(): void {
    this.ssid = new Date().getTime().toString();
    localStorage.setItem('ob-ssid', this.ssid);
    localStorage.setItem('cs', '1'); // Current service - 1: on boarding, 2:  update cus info
  }
}
